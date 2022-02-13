import React, { useRef, useState, useEffect } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, Button, Divider } from '@mui/material';
import { useLocation } from 'react-router-dom';
import CustomHrSelect from './time';
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

function Kindai(){  
  const { state } = useLocation();
  const [userString, setUserString] = useState({familyName: '', firstName: ''});
  const dateArray = getDates(moment().month())

  useEffect(()=> {
    if(state) {
      setUserString(state);
    }
    else{
      setUserString(JSON.parse(String(window.localStorage.getItem('attendence_user_data'))));
    }
    
  }, []);

  return (
    <div className="kindai-area">
      {userString ? (
        // ユーザー情報がある場合
        <div>
          <div className="title-area">
            <div>
              <Typography>Welcome To Attendence System</Typography>
            </div>
            <div>
              <Typography>User: {userString.familyName} {userString.firstName}</Typography>
            </div>
          </div>
          <div className="button-area">
            <Button>勤怠登録</Button>
          </div>
          <div className="table-area">
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">日付</TableCell>
                    <TableCell align="center">業務区分</TableCell>
                    <TableCell align="center">開始時間</TableCell>
                    <TableCell align="center">終了時間</TableCell>
                    <TableCell align="center">休憩時間</TableCell>
                    <TableCell align="center">実働時間</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dateArray.map((row) => (
                    <TableRow key={`date${row}`}>
                      <TableCell align="center" size="small">{row}</TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      ) 
      :(
        // ユーザー情報がない場合
        <div>
          No User Data
        </div>
      )}
    </div>
  );
      
}
export default Kindai;
