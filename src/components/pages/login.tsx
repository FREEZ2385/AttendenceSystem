import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './css/register.css'

type T = {
  status: number,
  
}

function Login(): JSX.Element { 

const navigate = useNavigate();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errorMessage, setErrorMessage] = useState("");

const callBackendAPI = async (): Promise<T> => {
  const requestOptions = {
    crossDomain: true,
    method: 'POST',
    headers: { 
      "access-control-allow-origin" : "*",
      'Content-Type': 'application/json'
     },
    body: JSON.stringify({ email, password })
};
  const response = await fetch('/api/check-login-user', requestOptions);
  
  if(response.status === 200) navigate("/kindai");
  else if (response.status === 300) setErrorMessage("入力したEmailは未登録です。");
  else setErrorMessage("入力したパスワードが不正です。もう一度確認ください。");

  return response;
};

  return (
    <div className="login">
          <TextField label="メール" variant="outlined" onChange={(event) => setEmail(event.target.value)}/>
          <TextField label="パスワード" type="password" variant="outlined" onChange={(event) => setPassword(event.target.value)}/>
        <div>
          <Button variant="contained" onClick={() => {
                callBackendAPI();
          }}>ログイン</Button>
            <Button variant="contained" onClick={() => {
                navigate("/register");
          }}>新規登録</Button>
         
          <p> {errorMessage} </p>
    </div>
    </div>
  );
}

export default Login;
