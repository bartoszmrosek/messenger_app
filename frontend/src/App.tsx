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
  const { user, loginUser }: UserContextExports = useContext(UserContext);
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
  const [renderNavOnMobile, setRenderNavOnMobile] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    /* 
      This doesn't explain itself well, so i thought about writing this comment,
      it reautorizes user if connection is estabilished after losing it
    */
    standardSocket.on('connect', () => {
      if (user !== undefined && user !== null) {
        standardSocket.emit(
          'checkUserLoginData',
          {
            data: {
              email: user.email,
              password: user.user_id,
            },
          },
          (
            dbResponse: standardDbResponse<{
              user_id: number;
              username: string;
              email: string;
              password: string;
            }>,
          ) => {
            if (dbResponse.type === 'confirm') {
              const { payload } = dbResponse;
              if (loginUser !== undefined) {
                loginUser(payload.user_id, payload.username, payload.email);
              }
            } else {
              navigate('/Login');
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
        <Navbar shouldRender={renderNavOnMobile} />
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
          {user !== undefined && (
            <Route path="/Messeges" element={<Messeges />} />
          )}
          <Route path="/SearchResults" element={<SearchResultsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route
            path="/"
            element={
              <RegisterUserForm setRenderNavOnMobile={setRenderNavOnMobile} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
