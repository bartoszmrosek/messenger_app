import React, { useContext, useEffect, useState } from 'react';
import RegisterUserForm from './pages/RegisterUserForm';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './pages/LoginForm';
import Messeges from './pages/Messages';
import SearchResultsPage from './pages/SeachResultsPage';
import { UserContext } from './Contexts/UserContext';
import { SocketContext } from './Contexts/SocketContext';
import { UserContextExports } from './Contexts/UserContext';
import { standardDbResponse } from './interfaces/dbResponsesInterface';
import { Socket } from 'socket.io-client';
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from './interfaces/socketContextInterfaces';

const App = () => {
  const { loggedUser, loginUser, removeLoggedUser }: UserContextExports =
    useContext(UserContext);
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
  const [renderNavOnMobile, setRenderNavOnMobile] = useState<boolean>(true);
  const [searchOverlayOpened, setSearchOverlayOpened] =
    useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    /* 
      This doesn't explain itself well, so i thought about writing this comment,
      it reautorizes user if connection is estabilished after losing it
    */
    standardSocket.on('connect', () => {
      if (loggedUser) {
        standardSocket.timeout(10000).emit(
          'checkUserLoginData',
          {
            data: {
              email: loggedUser.email,
              password: loggedUser.user_id,
            },
          },
          (
            error: unknown,
            dbResponse: standardDbResponse<{
              user_id: number;
              username: string;
              email: string;
              password: string;
            }>,
          ) => {
            console.log(error);
            if (error || dbResponse.type === 'error') {
              if (removeLoggedUser) removeLoggedUser();
              navigate('/Login');
            } else {
              const { payload } = dbResponse;
              if (loginUser !== undefined) {
                loginUser(payload.user_id, payload.username, payload.email);
              }
            }
          },
        );
      }
    });
    return () => {
      standardSocket.io.off('reconnect');
    };
  }, []);

  return (
    <div className="h-full bg-porcelain min-h-min">
      <div className="absolute inset-0">
        <Navbar
          shouldRender={renderNavOnMobile}
          setSearchOverlayOpened={setSearchOverlayOpened}
        />
        <main
          className={`transition-all duration-1000 h-full min-h-min ${
            searchOverlayOpened && 'blur-sm'
          }`}
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
              element={
                <LoginForm setRenderNavOnMobile={setRenderNavOnMobile} />
              }
            />
            {loggedUser && (
              <>
                <Route path="/Messeges" element={<Messeges />} />
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
    </div>
  );
};

export default App;
