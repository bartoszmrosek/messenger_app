/* eslint-disable  @typescript-eslint/no-explicit-any */

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
    socket.on('checkOrCreateUser', async (payload, callback) => {
      const { data } = payload;
      await checkOrCreateUser(data, callback);
    });

    socket.on('checkUserLoginData', (payload, callback) => {
      const { data } = payload;
      checkUserLoginData(data, callback, socket.id);
    });

    socket.on('searchUser', async (payload, callback) => {
      searchUser(payload, callback);
    });

    socket.on('checkUserHistory', async (payload, callback) => {
      if (isUserAuthorized(payload, socket.id)) {
        checkUserHistory(payload, callback);
      } else
        callback({
          type: 'error',
          payload: 5,
        });
    });

    socket.on('newMessageToServer', (payload: NewMessage, callback) => {
      if (isUserAuthorized(payload.user_id, socket.id)) {
        handleNewMessage(io, payload, callback);
      } else
        callback({
          type: 'error',
          payload: 5,
        });
    });

    socket.on('disconnect', () => {
      disconnectUser(socket.id);
    });
  } catch (error) {
    console.log('Uncaught error: ', error);
  }
});

httpServer.listen(8000);
