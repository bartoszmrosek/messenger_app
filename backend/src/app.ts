import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createNewUser } from './dbHandler';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', socket => {
  socket.on('checkOrCreateUser', async (payload, callback) => {
    const { data } = payload;
    const userInformationsArray: string[] = [
      data.username,
      data.email,
      data.password,
    ];
    await createNewUser(userInformationsArray);
    callback(true);
  });
});

httpServer.listen(8000);
