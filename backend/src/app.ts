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

import type { NewMessage } from './dbHandler';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

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
        checkOrCreateUser(data, callback);
      },
    );

    socket.on(
      'checkUserLoginData',
      async (payload: { data: unknown }, callback) => {
        const { data } = payload;
        await checkUserLoginData(data, callback, socket.id);
      },
    );

    socket.on('searchUser', async (payload, callback) => {
      await searchUser(payload, callback);
    });

    socket.on('checkUserHistory', async (payload, callback: any) => {
      if (isUserAuthorized(payload, socket.id)) {
        await checkUserHistory(payload, callback);
      } else
        callback({
          type: 'error',
          payload: 5,
        });
    });

    socket.on(
      'newMessageToServer',
      async (payload: NewMessage, callback: any) => {
        if (isUserAuthorized(payload.user_id, socket.id)) {
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument*/
          await handleNewMessage(io, payload, callback);
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

httpServer.listen(8000);
