/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { isUserAuthorized, disconnectUser } from './users';

import checkOrCreateUser from './utils/checkOrCreateUser';
import checkUserLoginData from './utils/checkUserLoginData';
import searchUser from './utils/searchUser';
import checkUserHistory from './utils/checkUserHistory';
import handleNewMessage from './utils/handleNewMessage';
import { DbQueries, newMessage, userLoginDetails } from './queries';

const PORT = process.env.PORT || 3030;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const db = new DbQueries();

io.on('connection', socket => {
  try {
    socket.on(
      'checkOrCreateUser',
      (
        payload: {
          data: { password: string; username: string; email: string };
        },
        callback,
      ) => {
        const { data } = payload;
        void checkOrCreateUser(data, callback, db);
      },
    );

    socket.on(
      'checkUserLoginData',
      (payload: { data: userLoginDetails }, callback) => {
        const { data } = payload;
        console.log('function', data);
        void checkUserLoginData(data, callback, socket.id, db);
      },
    );

    socket.on('searchUser', (payload: string, callback) => {
      void searchUser(payload, callback, db);
    });

    socket.on('checkUserHistory', (userId: number, callback: any) => {
      if (isUserAuthorized(userId, socket.id)) {
        void checkUserHistory(userId, callback, db);
      } else
        callback({
          type: 'error',
          payload: 5,
        });
    });

    socket.on(
      'newMessageToServer',
      async (payload: newMessage, callback: any) => {
        if (isUserAuthorized(payload.user_id, socket.id)) {
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument*/
          await handleNewMessage(io, payload, callback, db);
        } else
          callback({
            type: 'error',
            payload: 5,
          });
      },
    );

    socket.on('disconnect', () => {
      disconnectUser(socket.id);
    });
  } catch (error) {
    console.log('Uncaught error: ', error);
  }
});

httpServer.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
