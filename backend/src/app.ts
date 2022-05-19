import e from 'express';
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
    const informations = await createNewUser(userInformationsArray);
    if(informations === undefined){
      callback('usrCreated')
    }else{
      console.log(informations.code === '23505')
      informations.code === '23505' ? callback('usrAlrInDb') : callback('connectionErr')
    }
  });
});

httpServer.listen(8000);
