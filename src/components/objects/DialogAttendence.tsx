import React, { useState } from 'react';
import { Select, MenuItem, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Button } from '@mui/material';
import './css/DialogAttendence.css';

// eslint-disable-next-line @typescript-eslint/ban-types
type props = { open: boolean; setOpen: (bool: boolean) => void; dateArray: Array<string> } & typeof defaultProps;

const defaultProps = {
    open: false,
};

type minMax = {
    min: number,
    max: number,
};


export default function DialogAttendence(props: props): JSX.Element   {
    const {open, setOpen, dateArray} = props;

    const handleClose = () => {
        setOpen(false);
    };

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
    

    const [workedDate, setWorkedDate] = useState(dateArray[0]);
    const [workedCategory, setWorkedCategory] = useState(workedCategoryList[0]);
    const [startHour, setStartHour] = useState('00');
    const [startMinute, setStartMinute] = useState('00');
    const [endHour, setEndHour] = useState('00');
    const [endMinute, setEndMinute] = useState('00');
    const [breakHour, setBreakHour] = useState('00');
    const [breakMinute, setBreakMinute] = useState('00');

    const isActiveTime = (workedCategory === '休日' || workedCategory === '有給休暇');
    

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
                            onChange={(event) => {setWorkedDate(event.target.value)}}
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
                    <TextField id="outlined-basic" variant="outlined" />

                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>キャンセル</Button>
                <Button onClick={handleClose}>保存</Button>
            </DialogActions>
        </Dialog>
    );
}

