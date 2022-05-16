import { useState } from 'react';
import { io, Socket } from 'socket.io-client';
import RegisterUserForm from './pages/RegisterUserForm';

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

function App() {
  return <RegisterUserForm socket={socket} />;
}

export default App;
