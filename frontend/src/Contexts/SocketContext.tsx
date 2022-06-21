import React, { FunctionComponent, createContext } from 'react';
import { io, Socket } from 'socket.io-client';

import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../interfaces/socketContextInterfaces';
interface SocketChildrenProps {
  children?: React.ReactNode;
}

const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:8000/',
);

const SocketContext = createContext(standardSocket);
const SocketContextProvider: FunctionComponent<SocketChildrenProps> = ({
  children,
}) => {
  return (
    <SocketContext.Provider value={standardSocket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContextProvider, SocketContext };
