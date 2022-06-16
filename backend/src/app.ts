import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import {
  createNewUser,
  loginUser,
  searchUser,
  searchHistory,
  saveNewMessageToDataBase,
} from './dbHandler';
import { nanoid } from 'nanoid';
import type { NewMessage } from './dbHandler';

interface UserDetails {
  user_id: number;
  username: string;
  email: string;
}
interface UserIdWithSocket {
  userId: number;
  socketId: string;
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

let currentlyConnectedUsers: UserIdWithSocket[] = [];
const checkIsUserConnected = (
  userId: number,
): UserIdWithSocket | 'Not connected' => {
  const isConnected = currentlyConnectedUsers.find(user => {
    return user.userId === userId;
  });
  if (isConnected !== undefined) {
    return isConnected;
  } else {
    return 'Not connected';
  }
};

io.on('connection', socket => {
  try {
    socket.on('checkOrCreateUser', async (payload, callback) => {
      const { data } = payload;
      const userInformationsArray: string[] = [
        data.username,
        data.email,
        data.password,
      ];
      const informations = await createNewUser(userInformationsArray);
      if (informations === undefined) {
        callback({
          type: 'confirm',
          payload: null,
        });
      } else {
        informations.code === '23505'
          ? callback({
              type: 'error',
              payload: 1,
            })
          : callback({
              type: 'error',
              payload: 0,
            });
      }
    });

    socket.on('checkUserLoginData', async (payload, callback) => {
      const { data } = payload;
      const userInformations: [string, string | number] = [
        data.email,
        data.password,
      ];
      const callbackInfo: UserDetails | number = await loginUser(
        userInformations,
      );
      if (typeof callbackInfo === 'number') {
        switch (callbackInfo) {
          case 2:
            callback({
              type: 'error',
              payload: 2,
            });
            break;
          case 3:
            callback({
              type: 'error',
              payload: 3,
            });
            break;
          default:
            callback({
              type: 'error',
              payload: callbackInfo,
            });
            break;
        }
      } else {
        currentlyConnectedUsers.push({
          userId: callbackInfo.user_id,
          socketId: socket.id,
        });
        callback({
          type: 'confirm',
          payload: callbackInfo,
        });
      }
    });

    socket.on('searchUser', async (payload, callback) => {
      try {
        const callbackInfo: any | number | 'unknown' = await searchUser(
          payload,
        );
        if (typeof callbackInfo !== 'number' && callbackInfo !== 'unknown') {
          callback({
            type: 'confirm',
            payload: callbackInfo.rows,
          });
        } else {
          callback({
            type: 'error',
            payload: callbackInfo,
          });
        }
      } catch (error) {
        callback({
          type: 'error',
          payload: error,
        });
      }
    });

    socket.on('checkUserHistory', async (payload, callback) => {
      try {
        const callbackInfo: any[] | 'unknown' | 0 = await searchHistory(
          payload,
        );
        if (callbackInfo !== 'unknown' && callbackInfo !== 0) {
          callback({
            type: 'confirm',
            payload: callbackInfo,
          });
        } else {
          callback({
            type: 'error',
            payload: callbackInfo,
          });
        }
      } catch (error) {
        callback({
          type: 'error',
          payload: error,
        });
      }
    });

    socket.on('newMessageToServer', async (payload: NewMessage, callback) => {
      const stateOfRecieverUser = checkIsUserConnected(
        payload.reciever_user_id,
      );
      const {
        created_at,
        is_read,
        message,
        reciever_user_id,
        sender_user_id,
        username,
      } = payload;
      if (stateOfRecieverUser !== 'Not connected') {
        try {
          io.sockets
            .timeout(10000)
            .to(stateOfRecieverUser.socketId)
            .emit('newMessageToClient', {
              username,
              sender_user_id,
              reciever_user_id,
              message,
              is_read,
              created_at,
              message_id: nanoid(),
            });
          callback('delivered');
        } catch (error) {
          console.log(error);
          callback('sent');
        }
      } else {
        callback('sent');
      }
      await saveNewMessageToDataBase(payload);
    });

    socket.on('disconnect', () => {
      currentlyConnectedUsers = currentlyConnectedUsers.filter(user => {
        return user.socketId !== socket.id;
      });
    });
  } catch (error) {
    console.log('Uncaught error: ', error);
  }
});

httpServer.listen(8000);
