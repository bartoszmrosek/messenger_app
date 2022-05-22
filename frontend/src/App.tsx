import { useEffect } from 'react';
import React from 'react'
import RegisterUserForm from './pages/RegisterUserForm';
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import LoginForm from './pages/LoginForm'

function App() {
  return(
    <div>
      <Navbar />
      <Routes>
        <Route path='Register' element={<RegisterUserForm />} />
        <Route path='Login' element={<LoginForm />} />
      </Routes>
    </div>
  );
}

export default App;
