import React, { useRef, useState, useEffect, useContext, useCallback } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, Button, Divider } from '@mui/material';
import { useLocation, useNavigate, UNSAFE_NavigationContext } from 'react-router-dom';
import DialogAttendence from '../objects/DialogAttendence';
import CustomHrSelect from './time';
import { Location } from "history";
import { userInfo } from "./login"
import moment from 'moment';
import './css/kindai.css';

function getDates(month: number) {
  let startDate = moment().month(month).startOf("month");
  const endDate = moment().month(month).endOf("month").format('YYYY/MM/DD');
  const dateArray = [];
  const stopDate = moment(endDate);
  while (startDate <= stopDate) {
      dateArray.push( moment(startDate).format('YYYY/MM/DD') )
      startDate = moment(startDate).add(1, 'days');
  }
  return dateArray;
}

type T = {
  status: number,
}

export type attendenceData = {
    workedCategory: string,
    workedDate: string,
    startTime: string,
    endTime: string,
    offTime: string,
    workedTime: string,
    workedContent: string,
}

function Kindai() : JSX.Element{  
  const location = useLocation();
  const state = location.state as userInfo;
  const [userString, setUserString] = useState({familyName: '', firstName: '', email: '', id: -1, remainHoliday: -1,workedDay: 0, offedDay: 0, workedTime: ''});
  const dateArray = getDates(moment().month());
  const [kindaiArray, setKindaiArray] = useState<Array<attendenceData>>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const callBackendGetAllKindaiAPI = async (userId:number): Promise<T>=> {
    const requestOptions = {
      crossDomain: true,
      method: 'POST',
      headers: { 
        "access-control-allow-origin" : "*",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
          user: userId, 
      })
    };
    const response = await fetch('/api/get-all-kindai', requestOptions);
    
    if(response.status === 200) {
        response.json().then(data => {
          setKindaiArray(data);
        });
    }
    return response;
  };

  useEffect(()=> {
    if(state && location.key !== "default") {
      setUserString({
        id: state?.id,
        email: state?.email,
        firstName: state?.firstName,
        familyName: state?.familyName,
        remainHoliday: state?.remainHoliday,
        workedDay: state?.workedDay,
        offedDay: state?.offedDay,
        workedTime: state?.workedTime,
      });
      callBackendGetAllKindaiAPI(state?.id);
    }
    else{
      const userData = JSON.parse(String(window.localStorage.getItem('attendence_user_data')))
      setUserString(userData)
      callBackendGetAllKindaiAPI(userData?.id);
    }
  }, []);

  return (
    <div className="kindai-area">
      {userString ? (
        // ?????????????????????????????????
        <div>
          <DialogAttendence open={dialogOpen} setOpen={(bool) => setDialogOpen(bool)} userString={userString} setUserString={(userInfo) => setUserString(userInfo)} dateArray={dateArray} kindaiArray={kindaiArray} setKindaiArray={(data)=> setKindaiArray(data)}/>
          <div className="title-area">
            <div>
              <Typography>Welcome To Attendence System</Typography>
            </div>
            <div>
              <Typography>User: {userString.familyName} {userString.firstName}</Typography>
            </div>
          </div>
          <div className="button-area">
            <Button onClick={()=> setDialogOpen(true)}>????????????</Button>
            <Button onClick={() => { window.localStorage.clear(); navigate("/");}}>???????????????</Button>
          </div>
           <div className="output-area">
          <TableContainer >
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">????????????</TableCell>
                    <TableCell align="center">??????</TableCell>
                    <TableCell align="center">????????????</TableCell>
                    <TableCell align="center">????????????</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    <TableCell align="center">{userString.workedDay}</TableCell> 
                    <TableCell align="center">{userString.offedDay}</TableCell>
                      <TableCell align="center">{userString.remainHoliday}</TableCell>
                      <TableCell align="center">{userString.workedTime}</TableCell>
                    </TableBody>
                    </Table>
            </TableContainer>
          </div>
          <div className="table-area">
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">??????</TableCell>
                    <TableCell align="center">????????????</TableCell>
                    <TableCell align="center">????????????</TableCell>
                    <TableCell align="center">????????????</TableCell>
                    <TableCell align="center">????????????</TableCell>
                    <TableCell align="center">????????????</TableCell>
                    <TableCell align="center">????????????</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dateArray.map((row) => (
                    <TableRow key={`date${row}`}>
                      <TableCell align="center" size="small">{row}</TableCell>
                      <TableCell align="center">
                        {/* ???????????? */}
                        {kindaiArray.some((data)=> moment(data.workedDate).format('YYYY/MM/DD') === row) &&
                        kindaiArray.find((data)=> moment(data.workedDate).format('YYYY/MM/DD') === row)?.workedCategory}
                      </TableCell>
                      <TableCell align="center">
                        {/* ???????????? */}
                        {kindaiArray.some((data)=> moment(data.workedDate).format('YYYY/MM/DD') === row) &&
                        moment.utc(kindaiArray.find((data)=> moment(data.workedDate).format('YYYY/MM/DD') === row)?.startTime).format('HH:mm')}
                      </TableCell>
                      <TableCell align="center">
                        {/* ???????????? */}
                        {kindaiArray.some((data)=> moment(data.workedDate).format('YYYY/MM/DD') === row) &&
                        moment.utc(kindaiArray.find((data)=> moment(data.workedDate).format('YYYY/MM/DD') === row)?.endTime).format('HH:mm')}
                      </TableCell>
                      <TableCell align="center">
                        {/* ???????????? */}
                        {kindaiArray.some((data)=> moment(data.workedDate).format('YYYY/MM/DD') === row) &&
                        moment.utc(kindaiArray.find((data)=> moment(data.workedDate).format('YYYY/MM/DD') === row)?.offTime).format('HH:mm')}
                      </TableCell>
                      <TableCell align="center">
                        {/* ???????????? */}
                        {kindaiArray.some((data)=> moment(data.workedDate).format('YYYY/MM/DD') === row) &&
                        moment.utc(kindaiArray.find((data)=> moment(data.workedDate).format('YYYY/MM/DD') === row)?.workedTime).format('HH:mm')}
                      </TableCell>
                      <TableCell align="center">
                        {/* ???????????? */}
                        {kindaiArray.some((data)=> moment(data.workedDate).format('YYYY/MM/DD') === row) &&
                        kindaiArray.find((data)=> moment(data.workedDate).format('YYYY/MM/DD') === row)?.workedContent}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      ) 
      :(
        // ?????????????????????????????????
        <div>
          No User Data
        </div>
      )}
    </div>
  );
      
}
export default Kindai;
