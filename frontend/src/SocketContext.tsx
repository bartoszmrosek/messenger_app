import { FunctionComponent } from 'react';
import { createContext, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:8000/'
);

interface SocketChildrenProps {
    children?: React.ReactNode;
  }

const SocketContext = createContext({});
const SocketContextProvider: FunctionComponent<SocketChildrenProps> = ({children}) => {
  return (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
      );
};

export { SocketContextProvider, SocketContext };
