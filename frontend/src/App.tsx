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
  const [renderNavOnMobile, setRenderNavOnMobile] = useState<boolean>(true);
  const [searchOverlayOpened, setSearchOverlayOpened] =
    useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    /* 
      This doesn't explain itself well, so i thought about writing this comment,
      it reautorizes user if connection is estabilished after losing it
    */
    if (loggedUser) {
      (async () => {
        try {
          const response = await fetch('http://localhost:3030/api/Login', {
            method: 'POST',
            headers: {
              'content-type': 'application/json;charset=UTF-8',
            },
            credentials: 'include',
          });
          if (response.ok) {
            const data: userInformationsInterface = await response.json();
            const { user_id, username, email } = data;
            if (user_id && username && email) {
              loginUser(user_id, username, email);
            }
          } else {
            throw 'relogin needed';
          }
        } catch (error) {
          logoutUser();
          navigate('/Login', { state: { relogin: true } });
        }
      })();
    }
  }, []);

  return (
    <div className="absolute inset-0 bg-porcelain min-h-fit w-full">
      <Navbar
        shouldRender={renderNavOnMobile}
        setSearchOverlayOpened={setSearchOverlayOpened}
      />
      <main
        className={`transition-all duration-1000 h-full ${
          searchOverlayOpened && 'blur-sm'
        } bg-porcelain`}
      >
        <Routes>
          <Route
            path="/Register"
            element={
              <RegisterUserForm setRenderNavOnMobile={setRenderNavOnMobile} />
            }
          />
          <Route
            path="/Login"
            element={<LoginForm setRenderNavOnMobile={setRenderNavOnMobile} />}
          />
          {loggedUser && (
            <>
              <Route
                path="/Messages"
                element={
                  <Messages setRenderNavOnMobile={setRenderNavOnMobile} />
                }
              />
              <Route path="/SearchResults" element={<SearchResultsPage />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route
            path="/"
            element={
              <RegisterUserForm setRenderNavOnMobile={setRenderNavOnMobile} />
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
