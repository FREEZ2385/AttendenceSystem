import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Login from './components/pages/login';
import Register from './components/pages/register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register text="register"/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
