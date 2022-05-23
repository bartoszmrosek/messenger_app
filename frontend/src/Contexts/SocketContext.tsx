import React, { FunctionComponent, createContext } from 'react';
import { io, Socket } from 'socket.io-client';

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: any) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface SocketChildrenProps {
  children?: React.ReactNode;
}

const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:8000/',
);

const SocketContext = createContext({});
const SocketContextProvider: FunctionComponent<SocketChildrenProps> = ({
  children,
}) => {
  return (
    <SocketContext.Provider value={{ standardSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContextProvider, SocketContext };
