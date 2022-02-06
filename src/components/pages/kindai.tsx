import React, { useRef, useState } from 'react';
import { Button, TextField ,FormControl,InputLabel,Select,MenuItem,NativeSelect} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './css/register.css';
import CustomHrSelect from './time';


function Kindai(){  

  const [StartHrvalue,setStartHrvalue] = useState("");
  const [StartMmvalue,setStartMmvalue] = useState("");
  const [EndHrvalue,setEndHrvalue] = useState("");
  const [EndMmvalue,setEndMmvalue] = useState("");
  const [RelaxHrvalue,setRelaxHrvalue] = useState("");
  const [RelaxMmvalue,setRelaxMmvalue] = useState("");

      // if (Startvalue === '') {
      //   setStartvalue('9') ;
      // }
      // if (Endvalue === ''){
      //     setEndvalue('18') ;
      //   }
      // if (Relaxvalue === ''){
      //     setRelaxvalue('1') ;
      //   }

      //  const Worktime= parseFloat(Endvalue) - parseFloat(Startvalue) - parseFloat(Relaxvalue)
        
    return (
    <div className="kindai">
<div className ="StartTime">
  <label>始業時刻</label>
 


<TextField id="select" onChange={(event) => setStartMmvalue(event.target.value)} select  defaultValue={0}
    inputProps={{
      name: 'StartTime',
      id: 'uncontrolled-native',
    }}>
  <MenuItem value="0">00</MenuItem>
  <MenuItem value="5">05</MenuItem>
  <MenuItem value="10">10</MenuItem>
  <MenuItem value="15">15</MenuItem>
  <MenuItem value="20">20</MenuItem>
  <MenuItem value="25">25</MenuItem>
  <MenuItem value="30">30</MenuItem>
  <MenuItem value="35">35</MenuItem>
  <MenuItem value="40">40</MenuItem>
  <MenuItem value="45">45</MenuItem>
  <MenuItem value="50">50</MenuItem>
  <MenuItem value="55">55</MenuItem>
  <MenuItem value="60">60</MenuItem>
</TextField>

{/* </div>

         <TextField id="select" label="休憩時間" onChange={(event) => setRelaxvalue(event.target.value)} select  defaultValue={1}
    inputProps={{
      name: 'LunchTime',
      id: 'uncontrolled-native',
    }}>
  <MenuItem value="0.5">0:30</MenuItem>
  <MenuItem value="1">1:00</MenuItem> 
</TextField>

<TextField id="select" label="終了時間" onChange={(event) => setEndvalue(event.target.value)} select  defaultValue={18}
    inputProps={{
      name: 'EndTime',
      id: 'uncontrolled-native',
    }}>

  <MenuItem value="0">0:00</MenuItem>
  <MenuItem value="1">1:00</MenuItem>
  <MenuItem value="2">2:00</MenuItem>
  <MenuItem value="3">3:00</MenuItem>
  <MenuItem value="4">4:00</MenuItem>
  <MenuItem value="5">5:00</MenuItem>
  <MenuItem value="6">6:00</MenuItem>
  <MenuItem value="7">7:00</MenuItem>
  <MenuItem value="8">8:00</MenuItem>
  <MenuItem value="9">9:00</MenuItem>
  <MenuItem value="10">10:00</MenuItem>
  <MenuItem value="11">11:00</MenuItem>
  <MenuItem value="12">12:00</MenuItem>
  <MenuItem value="13">13:00</MenuItem>
  <MenuItem value="14">14:00</MenuItem>
  <MenuItem value="15">15:00</MenuItem>
  <MenuItem value="16">16:00</MenuItem>
  <MenuItem value="17">17:00</MenuItem>
  <MenuItem value="18">18:00</MenuItem>
  <MenuItem value="19">19:00</MenuItem>
  <MenuItem value="20">20:00</MenuItem>
  <MenuItem value="21">21:00</MenuItem>
  <MenuItem value="22">22:00</MenuItem>
  <MenuItem value="23">23:00</MenuItem>
  <MenuItem value="24">24:00</MenuItem>
</TextField>

<TextField label="就労時間" variant="outlined" value={Worktime}/>  */}
    </div> 
    </div>
      );
}

export default Kindai;
