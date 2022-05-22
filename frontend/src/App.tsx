import React, { useContext } from 'react';
import RegisterUserForm from './pages/RegisterUserForm';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import { UserContext } from './Contexts/UserContext';
import Messeges from './pages/Messeges';

function App() {
  const loggedUser: any = useContext(UserContext)
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/Register" element={<RegisterUserForm />} />
        <Route path="/Login" element={<LoginForm />} />
        {loggedUser.userInformations.user_id !== undefined && 
        <Route path='/Messeges' element={<Messeges />}/>}
        <Route path='*' element={<Navigate to='/' replace/>}/>
        <Route path='/' element={<div>Nice</div>}/>
      </Routes>
    </div>
  );
}

export default App;
