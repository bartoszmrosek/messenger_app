import React, { useContext, useEffect, useState } from 'react';
import RegisterUserForm from './pages/RegisterUserForm';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './pages/LoginForm';
import Messages from './pages/Messages';
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
  const { loggedUser, loginUser, logoutUser, connectingUserState } = useContext(
    UserContext,
  ) as UserContextExports;
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
  const [renderNavOnMobile, setRenderNavOnMobile] = useState<boolean>(true);
  const [searchOverlayOpened, setSearchOverlayOpened] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const { setIsConnectingUser } = connectingUserState;
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
            setIsConnectingUser(true);
            if (error || dbResponse.type === 'error') {
              setIsConnectingUser(false);
              if (logoutUser) logoutUser();
              navigate('/Login');
            } else {
              const { payload } = dbResponse;
              if (loginUser !== undefined) {
                loginUser(payload.user_id, payload.username, payload.email);
              }
              setIsConnectingUser(false);
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
    <div className="absolute inset-0 bg-porcelain">
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
              <Route path="/Messages" element={<Messages />} />
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
