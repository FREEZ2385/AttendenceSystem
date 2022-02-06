import React, { Component ,useState} from 'react'
import { TextField,MenuItem } from '@mui/material';

class CustomHrSelect extends Component {

  render() {


    return <div className="time">
        <TextField id="select" select  defaultValue={9}
    inputProps={{
      name: 'StartTime',
      id: 'uncontrolled-native',
    }}>
      <MenuItem value="0">0</MenuItem>
      <MenuItem value="1">1</MenuItem>
      <MenuItem value="2">2</MenuItem>
      <MenuItem value="3">3</MenuItem>
      <MenuItem value="4">4</MenuItem>
      <MenuItem value="5">5</MenuItem>
      <MenuItem value="6">6</MenuItem>
      <MenuItem value="7">7</MenuItem>
      <MenuItem value="8">8</MenuItem>
      <MenuItem value="9">9</MenuItem>
      <MenuItem value="10">10</MenuItem>
      <MenuItem value="11">11</MenuItem>
      <MenuItem value="12">12</MenuItem>
      <MenuItem value="13">13</MenuItem>
      <MenuItem value="14">14</MenuItem>
      <MenuItem value="15">15</MenuItem>
      <MenuItem value="16">16</MenuItem>
      <MenuItem value="17">17</MenuItem>
      <MenuItem value="18">18</MenuItem>
      <MenuItem value="19">19</MenuItem>
      <MenuItem value="20">20</MenuItem>
      <MenuItem value="21">21</MenuItem>
      <MenuItem value="22">22</MenuItem>
      <MenuItem value="23">23</MenuItem>
      <MenuItem value="24">24</MenuItem>
    </TextField>
    </div>
  }
}

export default CustomHrSelect;

// class CustomMmSelect extends Component {
//     render() {
        
//       return <div className="time">
//       <TextField id="select" select>
//         <MenuItem value="0">00</MenuItem>
//         <MenuItem value="5">05</MenuItem>
//         <MenuItem value="10">10</MenuItem>
//         <MenuItem value="15">15</MenuItem>
//         <MenuItem value="20">20</MenuItem>
//         <MenuItem value="25">25</MenuItem>
//         <MenuItem value="30">30</MenuItem>
//         <MenuItem value="35">35</MenuItem>
//         <MenuItem value="40">40</MenuItem>
//         <MenuItem value="45">45</MenuItem>
//         <MenuItem value="50">50</MenuItem>
//         <MenuItem value="55">55</MenuItem>
//         <MenuItem value="60">60</MenuItem>
//       </TextField>
//       </div>
//     }
//   }
  
//   export default CustomMmSelect