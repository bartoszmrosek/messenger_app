import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createNewUser, loginUser, searchUser, searchUserMessages } from './dbHandler';

interface UserDetails{
  user_id: number,
  username: string,
  email: string,
}
interface UserIdWithSocket{
  userId:number,
  socketId:string
}

interface NewMessage{
  user_id: number,
  message: string,
  sender: number,
  reciever: number,
  isRead: boolean,
  created_at: string
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const currentlyConnectedUsers: UserIdWithSocket[] = [];
const checkIsUserConnected = (userId:number): UserIdWithSocket|'Not connected' =>{
  const isConnected = currentlyConnectedUsers.find((user)=>{
    return user.userId === userId;
  })
  if(isConnected !== undefined){
    return isConnected;
  }else{
    return 'Not connected'
  }
}

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
       currentlyConnectedUsers.push({
        userId: callbackInfo.user_id,
        socketId: socket.id
      })
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

  socket.on('newMessage', (payload: NewMessage, callback)=>{
    const shouldSentToUser = checkIsUserConnected(payload.reciever);
    if(shouldSentToUser !== 'Not connected'){
      socket.to(shouldSentToUser.socketId).emit('newMessage',
      payload
      , (isRecieved: boolean)=>{
        if(isRecieved===true){
          callback('delivered')
        }else{
          callback('sent')
        }
      })
    }else{
      callback('sent')
    }
    console.log(payload)
  })

});

httpServer.listen(8000);
