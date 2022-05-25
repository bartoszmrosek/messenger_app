import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createNewUser, loginUser, searchUser } from './dbHandler';

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
    if (informations === undefined) {
      callback('usrCreated');
    } else {
      console.log(informations.code === '23505');
      informations.code === '23505'
        ? callback('usrAlrInDb')
        : callback('connectionErr');
    }
  });

  socket.on('checkUserLoginData', async (payload, callback) => {
    const { data } = payload;
    const userInformations: string[] = [data.email, data.password];
    const callbackInfo = await loginUser(userInformations);
    if (callbackInfo === undefined) {
      callback({
        type: 'usrInfoWrong',
        payload: null,
      });
    } else {
      callback({
        type: 'confirm',
        payload: callbackInfo,
      });
    }
  });

  socket.on('searchUser', async(payload, callback)=>{
    const callbackInfo: any[] | "error" = await searchUser(payload);
    if(callback!=='error'){
      callback(callbackInfo)
    }
  })
  console.log(socket.id);
});

httpServer.listen(8000);
