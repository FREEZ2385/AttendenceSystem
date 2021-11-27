import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import './css/register.css'

interface Props {
  text: string;
}

type T = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}


function Register({ text }: Props): JSX.Element {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  
  const callBackendAPI = async (): Promise<T> => {
    const requestOptions = {
      crossDomain: true,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password })
  };
    const response = await fetch('http://localhost:3002/api/insert-user', requestOptions);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  return (
    <div className="register">
        <TextField label="First Name" variant="outlined" onChange={(event) => setFirstName(event.target.value)}/>
        <TextField label="Last Name" variant="outlined" onChange={(event) => setLastName(event.target.value)}/>
        <TextField label="Email" variant="outlined" onChange={(event) => setEmail(event.target.value)}/>
        <TextField label="Password" type="password" variant="outlined" onChange={(event) => setPassword(event.target.value)}/>
        <TextField label="Password confirm" type="password" variant="outlined" onChange={(event) => setPasswordConfirmation(event.target.value)}/>
        <div>
          <Button variant="contained" 
          disabled={(password === '' || password !== passwordConfirmation)} 
          onClick={() => callBackendAPI()}>Register</Button>
          <Button variant="contained">Cancel</Button>
        </div>
    </div>
  );
}

export default Register;
