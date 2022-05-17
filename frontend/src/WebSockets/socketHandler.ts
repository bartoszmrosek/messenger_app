import { io, Socket } from 'socket.io-client';

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
  }
  interface ClientToServerEvents {
    hello: () => void;
  }
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:8000/');
function startSocketConnetion(){
  socket.on('connect', ()=>{
      console.log(socket.id)
  })
}
export default startSocketConnetion;