import React, { useEffect, useState } from 'react';
import { Select, MenuItem, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Button } from '@mui/material';
import './css/DialogAttendence.css';
import { userInfo } from "../pages/login"
import { attendenceData } from "../pages/kindai"
import moment from 'moment';

// eslint-disable-next-line @typescript-eslint/ban-types
type props = { open: boolean; setOpen: (bool: boolean) => void; userString: userInfo; 
    setUserString: (userInfo: userInfo) => void; 
    dateArray: Array<string>, 
    kindaiArray: Array<attendenceData>,
    setKindaiArray: (data: Array<attendenceData>) => void; } & typeof defaultProps;

const defaultProps = {
    open: false,
    userString: {
        familyName: "",
        firstName: "",
        email: "",
        id: -1,
        remainHoliday: -1,
    },
};

type T = {
    status: number,  
}

type minMax = {
    min: number,
    max: number,
};


export default function DialogAttendence(props: props): JSX.Element   {
    const {open, setOpen, userString, setUserString, dateArray, kindaiArray, setKindaiArray} = props;

    const hourMinMax = { min: 0, max: 23 };
    const minuteMinMax = { min: 0, max: 59 };

    const timeCal = (time: string, minMax: minMax) => {
        let timeInt = 0;
        if(time !== '') timeInt = parseInt(time);
        const minNum = minMax.min;
        const maxNum = minMax.max;
        if(timeInt > maxNum) return String(minMax.max);
        else if(timeInt < minNum) return String(minMax.max);
        else return String(timeInt);
    }

    const workedCategoryList= ['勤務', '有給休暇', '自宅勤務', '休日'];
    
    const tdyDate = moment().format('YYYY/MM/DD');
    
    const [workedDate, setWorkedDate] = useState(tdyDate);
    const [workedCategory, setWorkedCategory] = useState(workedCategoryList[0]);
    const [startHour, setStartHour] = useState('00');
    const [startMinute, setStartMinute] = useState('00');
    const [endHour, setEndHour] = useState('00');
    const [endMinute, setEndMinute] = useState('00');
    const [breakHour, setBreakHour] = useState('00');
    const [breakMinute, setBreakMinute] = useState('00');
    const [workedContent, setWorkedContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    
    const isActiveTime = (workedCategory === '休日' || workedCategory === '有給休暇');
    const isValidTime = (moment.duration(moment(`${endHour}:${endMinute}:00`, "HH:mm:ss").diff(moment(`${startHour}:${startMinute}:00`, "HH:mm:ss")))
        .asHours() < 0
    )
   
    const resetInput = () => {
        setWorkedCategory(workedCategoryList[0]);
        setStartHour('00');
        setStartMinute('00');
        setEndHour('00');
        setEndMinute('00');
        setBreakHour('00');
        setBreakMinute('00');
        setWorkedContent('');
        setErrorMessage('');
    }

    const callBackendGetKindaiAPI = async (date: string): Promise<T>=> {
        const requestOptions = {
          crossDomain: true,
          method: 'POST',
          headers: { 
            "access-control-allow-origin" : "*",
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
              user: userString.id, 
              workedDate: moment(date, "YYYY/MM/DD").format('YYYY-MM-DD'),
             })
        };
        const response = await fetch('/api/get-kindai', requestOptions);
        
        if(response.status === 200) {
            response.json().then(data => {
                if(data.WorkedDate){
                    setWorkedCategory(data.WorkedCategory);
                    setStartHour(String(moment(data.StartTime).utc().hour()).padStart(2, '0'));
                    setStartMinute(String(moment(data.StartTime).utc().minute()).padStart(2, '0'));
                    setEndHour(String(moment(data.EndTime).utc().hour()).padStart(2, '0'));
                    setEndMinute(String(moment(data.EndTime).utc().minute()).padStart(2, '0'));
                    setBreakHour(String(moment(data.OffTime).utc().hour()).padStart(2, '0'));
                    setBreakMinute(String(moment(data.OffTime).utc().minute()).padStart(2, '0'));
                    setWorkedContent(data.WorkedContent);
                    setErrorMessage('');
                } else {
                    resetInput();
                }
            });
        }
        return response;
    };

    const handleClose = () => {
        setOpen(false);
        setWorkedDate(tdyDate);
    };

    useEffect(()=> {
        if(userString.id !== -1) callBackendGetKindaiAPI(workedDate);
    }, [kindaiArray]);

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
        handleClose();
        return response;
      };
    
    const callBackendInsertKindaiAPI = async (): Promise<T>=> {
        const breakTime =  moment.duration(`${breakHour}:${breakMinute}:00`).asHours();
        const workedTime = moment(`${endHour}:${endMinute}:00`, "HH:mm:ss").subtract(breakTime, 'hours').subtract(moment.duration(`${startHour}:${startMinute}:00`).asHours(), 'hours').format('HH:mm:ss');

        const requestOptions = {
          crossDomain: true,
          method: 'POST',
          headers: { 
            "access-control-allow-origin" : "*",
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
              user: userString.id, 
              workedDate: moment(workedDate, "YYYY/MM/DD").format('YYYY-MM-DD'),
              workedCategory,
              startTime: moment(`${startHour}:${startMinute}:00`, "HH:mm:ss").format('HH:mm:ss'),
              endTime: moment(`${endHour}:${endMinute}:00`, "HH:mm:ss").format('HH:mm:ss'),
              offTime: moment(`${breakHour}:${breakMinute}:00`, "HH:mm:ss").format('HH:mm:ss'),
              workedTime,
              workedContent
             })
        };
        const response = await fetch('/api/insert-kindai', requestOptions);
        
        if(response.status === 200) {
            response.json().then(data => {
                setUserString(data);
                window.localStorage.setItem("attendence_user_data", JSON.stringify(data));
                callBackendGetAllKindaiAPI(userString.id);
            });
        }
        return response;
    };

    
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>勤怠登録</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Typography style={{margin: 'auto 15px'}}>日付</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Select 
                            size='small'
                            fullWidth
                            value={workedDate}  
                            onChange={(event) => {
                                setWorkedDate(event.target.value);
                                callBackendGetKindaiAPI(event.target.value);
                            }}
                        >
                        {dateArray.map((row:string)=>(<MenuItem key={row} value={row}>{row}</MenuItem>))}
                        </Select>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography style={{margin: 'auto 15px'}}>勤務区分</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Select 
                            size='small'
                            fullWidth
                            value={workedCategory}
                            onChange={(event) => {
                                setWorkedCategory(event.target.value);
                                if(!isActiveTime){
                                    setStartHour('00');
                                    setStartMinute('00');
                                    setEndHour('00');
                                    setEndMinute('00');
                                    setBreakHour('00');
                                    setBreakMinute('00');
                                    setWorkedContent('');
                                }
                            }}
                        >
                        {workedCategoryList.map((row:string)=>(<MenuItem key={row} value={row}>{row}</MenuItem>))}
                        </Select>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography style={{margin: 'auto 15px'}}>開始時間</Typography>
                    </Grid>
                    <Grid item xs={8} style={{display: 'flex'}}>
                        <TextField 
                            size='small' 
                            value={startHour}
                            disabled={isActiveTime}
                            onChange={(event) => {setStartHour(timeCal(event.target.value, hourMinMax).padStart(2, '0'))}}
                            type="number" 
                            InputProps={{ inputProps: {...hourMinMax, maxLength: 2} }} />
                        <Typography style={{margin: 'auto 15px'}}>時</Typography>
                        <TextField
                            size='small'
                            value={startMinute}
                            disabled={isActiveTime}
                            onChange={(event) => {setStartMinute(timeCal(event.target.value, minuteMinMax).padStart(2, '0'))}}
                            type="number"
                            InputProps={{ inputProps: {...minuteMinMax, maxLength: 2} }} 
                        />
                        <Typography style={{margin: 'auto 15px'}}>分</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography style={{margin: 'auto 15px'}}>終了時間</Typography>
                    </Grid>
                    <Grid item xs={8} style={{display: 'flex'}}>
                    <TextField 
                            size='small' 
                            value={endHour}
                            disabled={isActiveTime}
                            onChange={(event) => {setEndHour(timeCal(event.target.value, hourMinMax).padStart(2, '0'))}}
                            type="number" 
                            InputProps={{ inputProps: {...hourMinMax, maxLength: 2}, }} />
                        <Typography style={{margin: 'auto 15px'}}>時</Typography>
                        <TextField
                            size='small'
                            value={endMinute}
                            disabled={isActiveTime}
                            onChange={(event) => {setEndMinute(timeCal(event.target.value, minuteMinMax).padStart(2, '0'))}}
                            type="number"
                            InputProps={{ inputProps: {...minuteMinMax, maxLength: 2} }} 
                        />
                        <Typography style={{margin: 'auto 15px'}}>分</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography style={{margin: 'auto 15px'}}>休憩時間</Typography>
                    </Grid>
                    <Grid item xs={8} style={{display: 'flex'}}>
                    <TextField 
                            size='small' 
                            value={breakHour}
                            disabled={isActiveTime}
                            onChange={(event) => {setBreakHour(timeCal(event.target.value, hourMinMax).padStart(2, '0'))}}
                            type="number" 
                            InputProps={{ inputProps: {...hourMinMax, maxLength: 2}, }} />
                        <Typography style={{margin: 'auto 15px'}}>時</Typography>
                        <TextField
                            size='small'
                            value={breakMinute}
                            disabled={isActiveTime}
                            onChange={(event) => {setBreakMinute(timeCal(event.target.value, minuteMinMax).padStart(2, '0'))}}
                            type="number"
                            InputProps={{ inputProps: {...minuteMinMax, maxLength: 2} }} 
                        />
                        <Typography style={{margin: 'auto 15px'}}>分</Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography style={{margin: 'auto 15px'}}>業務内容</Typography>
                    </Grid>
                    <Grid item xs={8} style={{display: 'flex'}}>
                        <TextField id="outlined-basic" variant="outlined" value={workedContent} disabled={isActiveTime} onChange={(event) => setWorkedContent(event.target.value)}/>
                    </Grid> 
                </Grid>
            
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>キャンセル</Button>
             <Button 
                onClick={()=>{
                    if(isValidTime) {setErrorMessage('終了時間が開始時間より前の時間で入力されています。ご確認ください。');}
                    else if(workedCategory === '有給休暇' && userString.remainHoliday <= 0) {setErrorMessage('残有給数が0になっています。もう有給休暇を取れませんでした。');}
                    else{
                    setErrorMessage('');
                    callBackendInsertKindaiAPI();}
                }}
            >登録</Button>
            </DialogActions>
            <DialogContent>
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={9}>
                        <p>{errorMessage}</p>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}