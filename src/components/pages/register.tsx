import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import './css/register.css'
import { width } from '@mui/system';

interface Props {
  text: string;
}


function Register({ text }: Props): JSX.Element {

  return (
    <div className="register">
        <TextField label="First Name" variant="outlined" />
        <TextField label="Last Name" variant="outlined" />
        <TextField label="Email" variant="outlined" />
        <TextField label="Password" type="password" variant="outlined" />
        <TextField label="Password confirm" type="password" variant="outlined" />
        <div>
          <Button variant="contained">Register</Button>
          <Button variant="contained">Cancel</Button>
        </div>
    </div>
  );
}

export default Register;
