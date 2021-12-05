import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './css/register.css'

type T = {
  status: number,
  
}


function Register(): JSX.Element {

  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const callBackendAPI = async (): Promise<T> => {
    const requestOptions = {
      crossDomain: true,
      method: 'POST',
      headers: { 
        "access-control-allow-origin" : "*",
        'Content-Type': 'application/json'
       },
      body: JSON.stringify({ firstName, lastName, email, password })
  };
    const response = await fetch('/api/insert-user', requestOptions);

    if(response.status === 200) navigate("/login");
    else setErrorMessage("EmailとPasswordの登録に問題が発生しました。");

    return response;  
  };

  return (
    <div className="register">
        <TextField label="First Name" variant="outlined" onChange={(event) => setFirstName(event.target.value)}/>
        <TextField label="Last Name" variant="outlined" onChange={(event) => setLastName(event.target.value)}/>
        <TextField label="Email" variant="outlined" onChange={(event) => setEmail(event.target.value)}/>
        <TextField label="Password" type="password" variant="outlined" onChange={(event) => setPassword(event.target.value)}/>
        <TextField label="Password confirm" type="password" variant="outlined" onChange={(event) => setPasswordConfirmation(event.target.value)}/>
        <p> {errorMessage} </p>
        <div>
          <Button variant="contained" 
          disabled={(password === '' || password !== passwordConfirmation)} 
          onClick={() => {
              callBackendAPI();
          }}> 
          Register
          </Button>
          <Button variant="contained">Cancel</Button>
        </div>
    </div>
  );
}


export default Register;
