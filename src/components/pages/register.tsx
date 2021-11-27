import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import './css/register.css'

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
        <Button variant="contained">Register</Button>
    </div>
  );
}

export default Register;
