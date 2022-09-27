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

interface mousePositionInterface {
  x: number | null;
  y: number | null;
}

const App = () => {
  const { userInformations, handleNewInformations }: exportUserContextTypes =
    useContext(UserContext);
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
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
    <div className="h-screen">
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className=" relative h-screen w-screen flex justify-center items-center origin-center"
      >
        <path
          fill="#8A3FFC"
          d="M47.6,-77.5C59.5,-66.3,65.6,-49.5,70.3,-33.7C75,-17.9,78.4,-3.1,77.1,11.6C75.8,26.2,69.7,40.7,59.7,50.9C49.6,61.2,35.5,67.1,21.6,69.2C7.7,71.3,-6.1,69.5,-19.3,65.7C-32.5,61.8,-45.1,55.9,-58.1,47C-71.1,38.1,-84.5,26.1,-85.6,12.8C-86.8,-0.5,-75.7,-15,-65.4,-26.8C-55.2,-38.5,-45.8,-47.6,-35,-59.3C-24.3,-71,-12.1,-85.4,2.8,-89.8C17.8,-94.2,35.6,-88.7,47.6,-77.5Z"
          transform="translate(100 100)"
          className="animate-blob origin-center"
        />
      </svg>
      <div className=" absolute inset-0">
        <Navbar />
        <Routes>
          <Route path="/Register" element={<RegisterUserForm />} />
          <Route path="/Login" element={<LoginForm />} />
          {userInformations !== undefined && (
            <Route path="/Messeges" element={<Messeges />} />
          )}
          <Route path="/SearchResults" element={<SearchResultsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<RegisterUserForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
