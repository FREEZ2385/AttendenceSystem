import React from 'react';
import { Button, TextField } from '@mui/material';
import './css/register.css'

function Register() {
  return (
    <div className="register">
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        <Button variant="contained">Submit</Button>
    </div>
  );
}

export default Register;
