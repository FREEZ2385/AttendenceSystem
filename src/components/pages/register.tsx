import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
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

    // requestの結果によってメッセージを表示する
    // 200 = 成功する場合
    // 400 = 既にEmailが登録している場合
    // 500 = Requestでエラーが起きた場合（DBに問題がある場合）
    if(response.status === 200) navigate("/login");
    else if (response.status === 400) setErrorMessage("入力したEmailは既に登録済です。");
    else setErrorMessage("EmailとPasswordの登録に問題が発生しました。");

    return response;
  };

  return (
    <div className="register">
        <Typography style={{marginBottom: 10}} variant="h3">ユーザー新規登録</Typography>
        <TextField style={{marginBottom: 10}} label="ファーストネーム" variant="outlined" onChange={(event) => setFirstName(event.target.value)}/>
        <TextField style={{marginBottom: 10}} label="ラストネーム" variant="outlined" onChange={(event) => setLastName(event.target.value)}/>
        <TextField style={{marginBottom: 10}} label="メール" variant="outlined" onChange={(event) => setEmail(event.target.value)}/>
        <TextField style={{marginBottom: 10}} label="パスワード" type="password" variant="outlined" onChange={(event) => setPassword(event.target.value)}/>
        <TextField style={{marginBottom: 10}} label="確認パスワード" type="password" variant="outlined" onChange={(event) => setPasswordConfirmation(event.target.value)}/>
        <p> {errorMessage} </p>
        <Button variant="contained" 
                style={{marginBottom: 10}}
                disabled={(password === '' || 
                            password.length > 15 || 
                            password.length < 8 || 
                            password !== passwordConfirmation)} 
                onClick={() => {
                    callBackendAPI();
                }}
        > 
        新規登録
        </Button>
        <Button variant="outlined"
                style={{marginBottom: 10}}
                onClick={() =>
                  { 
                    const r = window.confirm("ログイン画面へ戻ります。よろしいですか?"); 
                    if(r == true){ navigate("/login")}
                  }
        }>
          キャンセル
        </Button>
        </div>
   
  );
}


export default Register;
