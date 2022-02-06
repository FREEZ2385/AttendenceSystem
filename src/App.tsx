import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Login from './components/pages/login';
import Register from './components/pages/register';
import Kindai from './components/pages/kindai';
import Time from './components/pages/time';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/kindai" element={<Kindai />}/>
          <Route path="/time" element={<Time />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
