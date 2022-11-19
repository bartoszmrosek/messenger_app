import React, { useContext, useEffect, useState } from 'react';
import RegisterUserForm from './pages/RegisterUserForm';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './pages/LoginForm';
import Messages from './pages/Messages';
import SearchResultsPage from './pages/SeachResultsPage';
import { UserContext } from './Contexts/UserContext';
import {
  UserContextExports,
  userInformationsInterface,
} from './Contexts/UserContext';

const App = () => {
  const { loggedUser, loginUser, logoutUser } = useContext(
    UserContext,
  ) as UserContextExports;
  const [searchOverlayOpened, setSearchOverlayOpened] =
    useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    /* 
      This doesn't explain itself well, so i thought about writing this comment,
      it reautorizes user if connection is estabilished after losing it
    */
    const controller = new AbortController();
    const signal = controller.signal;
    if (loggedUser) {
      (async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_REST_ENDPOINT}/api/Login`,
            {
              method: 'POST',
              headers: {
                'content-type': 'application/json;charset=UTF-8',
              },
              credentials: 'include',
              signal,
            },
          );
          if (!response.ok) throw 'relogin needed';
          const data: userInformationsInterface = await response.json();
          const { user_id, username, email } = data;
          if (user_id && username && email) {
            loginUser(user_id, username, email);
            navigate('/Messages');
          }
        } catch (error) {
          logoutUser();
          navigate('/Login', { state: { relogin: true } });
        }
      })();
    }
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-porcelain h-full w-full">
      <Navbar setSearchOverlayOpened={setSearchOverlayOpened} />
      <main
        className={`transition-all duration-1000 min-h-full h-full w-full flex justify-center items-center overflow-x-hidden ${
          searchOverlayOpened && 'blur-sm'
        } bg-porcelain`}
      >
        <Routes>
          <Route path="/Register" element={<RegisterUserForm />} />
          <Route path="/Login" element={<LoginForm />} />
          {loggedUser && (
            <>
              <Route path="/Messages" element={<Messages />} />
              <Route path="/SearchResults" element={<SearchResultsPage />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<RegisterUserForm />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
