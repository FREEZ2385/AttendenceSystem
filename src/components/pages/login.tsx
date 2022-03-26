import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './css/login.css'

type T = {
  status: number,
}

export interface userInfo {
  familyName: string,
  firstName: string,
  email: string,
  id: number,
  remainHoliday: number,
  workedDay: number,
  offedDay: number,
  workedTime: string,
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
    
    if(response.status === 200) {
      response.json().then(data => {
        window.localStorage.setItem("attendence_user_data", JSON.stringify(data));
        const resultData: userInfo = data;
        navigate("/kindai", { state: resultData});
    });
      
    }
    else setErrorMessage("入力したパスワードが不正です。もう一度確認ください。");

    return response;
  };

  return (
    <div className="login">
      <Typography style={{marginBottom: 10}} variant="h3">勤怠システム</Typography>
      <TextField style={{marginBottom: 10}} label="メール" variant="outlined" onChange={(event) => setEmail(event.target.value)}/>
      <TextField style={{marginBottom: 10}} label="パスワード" type="password" variant="outlined" onChange={(event) => setPassword(event.target.value)}/>
        <Button 
          variant="contained"
          onClick={() => {
            callBackendAPI();
          }}
          style={{marginBottom: 10}}
        >
          ログイン
        </Button>
        <Button
          variant="text" 
          onClick={() => {
            navigate("/register");
          }}
        >
          ユーザー新規登録
        </Button>
        
        <p> {errorMessage} </p>
    </div>
  );
}

export default Login;
