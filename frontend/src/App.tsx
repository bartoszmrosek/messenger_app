import React, { useContext, useEffect, useState } from 'react';
import RegisterUserForm from './pages/RegisterUserForm';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './pages/LoginForm';
import Messeges from './pages/Messages';
import SearchResultsPage from './pages/SeachResultsPage';
import { UserContext } from './Contexts/UserContext';
import { SocketContext } from './Contexts/SocketContext';
import type { exportUserContextTypes } from './Contexts/UserContext';
import type { standardDbResponse } from './interfaces/dbResponsesInterface';
import type { Socket } from 'socket.io-client';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from './interfaces/socketContextInterfaces';

const App = () => {
  const { userInformations, handleNewInformations }: exportUserContextTypes =
    useContext(UserContext);
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
    const [renderNavOnMobile, setRenderNavOnMobile] = useState<boolean>(true);
  useEffect(() => {
    /* 
      This doesn't explain itself well, so i thought about writing this comment,
      it reautorizes user if connection is estabilished after losing it
    */
    standardSocket.on('connect', () => {
      if (userInformations !== undefined) {
        standardSocket.emit(
          'checkUserLoginData',
          {
            data: {
              email: userInformations.email,
              password: userInformations.user_id,
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
              if (handleNewInformations !== undefined) {
                handleNewInformations(
                  payload.user_id,
                  payload.username,
                  payload.email,
                );
              }
            } else {
              console.log(dbResponse.type);
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
    <div className="h-screen bg-porcelain min-h-min">
      <div className="absolute inset-0">
        <Navbar shouldRender={renderNavOnMobile}/>
        <Routes>
          <Route path="/Register" element={<RegisterUserForm setRenderNavOnMobile={setRenderNavOnMobile}/>} />
          <Route path="/Login" element={<LoginForm />} />
          {userInformations !== undefined && (
            <Route path="/Messeges" element={<Messeges />} />
          )}
          <Route path="/SearchResults" element={<SearchResultsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<RegisterUserForm setRenderNavOnMobile={setRenderNavOnMobile} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
