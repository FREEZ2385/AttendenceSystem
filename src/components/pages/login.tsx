import React from 'react';
import { Button, TextField } from '@mui/material';

function Login() {
  return (
    <div className="login">
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        <Button variant="contained">Login</Button>
    </div>
  );
}

export default Login;
