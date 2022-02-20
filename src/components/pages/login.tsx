import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './css/register.css'

type T = {
  status: number,
}

export interface userInfo {
  familyName: string,
  firstName: string,
  email: string,
  id: number,
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
      <TextField label="メール" variant="outlined" onChange={(event) => setEmail(event.target.value)}/>
      <TextField label="パスワード" type="password" variant="outlined" onChange={(event) => setPassword(event.target.value)}/>
      <div>
        <Button 
          variant="contained"
          onClick={() => {
            callBackendAPI();
          }}
        >
          ログイン
        </Button>
        <Button
          variant="contained" 
          onClick={() => {
            navigate("/register");
          }}
        >
          新規登録
        </Button>
        
        <p> {errorMessage} </p>
      </div>
    </div>
  );
}

export default Login;
