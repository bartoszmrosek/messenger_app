import React, { useContext } from 'react';
import RegisterUserForm from './pages/RegisterUserForm';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import { UserContext } from './Contexts/UserContext';
import Messeges from './pages/Messeges';
import SearchResultsPage from './pages/SeachResultsPage'

function App() {
  const {userInformations}: any = useContext(UserContext);
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/Register" element={<RegisterUserForm />} />
        <Route path="/Login" element={<LoginForm />} />
        {userInformations !== undefined && (
          <Route path="/Messeges" element={<Messeges />} />
        )}
        <Route path="/SearchResults" element={<SearchResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<div>Nice</div>} />
      </Routes>
    </div>
  );
}

export default App;
