import React, { FunctionComponent, createContext } from 'react';
import { io, Socket } from 'socket.io-client';

import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../interfaces/socketContextInterfaces';
interface SocketChildrenInterface {
  children?: React.ReactNode;
}

const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://127.0.0.1:3030',
);

const SocketContext = createContext(standardSocket);
const SocketContextProvider: FunctionComponent<SocketChildrenInterface> = ({
  children,
}) => {
  return (
    <SocketContext.Provider value={standardSocket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContextProvider, SocketContext };
