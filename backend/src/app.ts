import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createNewUser, loginUser, searchUser, searchUserMessages } from './dbHandler';

interface UserDetails{
  user_id: number,
  username: string,
  email: string,
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const currentlyConnectedUsers: {user_id: number, socket_id: string}[] = [];

// CHANGE SOCKET IF USER ALREADY CONNECTED

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
    const callbackInfo: UserDetails = await loginUser(userInformations);
    if (callbackInfo === undefined) {
      callback({
        type: 'usrInfoWrong',
        payload: null,
      });
    } else {
      // INVOKE FILTERING FUNCTION
      /* currentlyConnectedUsers.push({
        user_id: callbackInfo.user_id,
        socket_id: socket.id
      }) */
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

  socket.on('checkUserHistory', async(payload, callback)=>{
    const callbackInfo: any | "error" = await searchUserMessages(payload);
    if(callback!=='error'){
      callback(callbackInfo)
    }
  })

  socket.on('newMessage', (payload: {user_id: number, message: string}, callback)=>{
    console.log(payload.user_id, payload.message)
    console.log(socket.id)
    callback('ack')
  })

  console.log(socket.id)
});

httpServer.listen(8000);
