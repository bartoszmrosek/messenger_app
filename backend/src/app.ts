import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { disconnectUser } from './users';

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
    socket.on('checkOrCreateUser', (payload, callback) => {
      const { data } = payload;
      checkOrCreateUser(data, callback);
    });

    socket.on('checkUserLoginData', (payload, callback) => {
      const { data } = payload;
      checkUserLoginData(data, callback, socket.id);
    });

    socket.on('searchUser', async (payload, callback) => {
      searchUser(payload, callback);
    });

    socket.on('checkUserHistory', async (payload, callback) => {
      checkUserHistory(payload, callback);
    });

    socket.on('newMessageToServer', (payload: NewMessage, callback) => {
      handleNewMessage(io, payload, callback);
    });

    socket.on('disconnect', () => {
      disconnectUser(socket.id);
    });
  } catch (error) {
    console.log('Uncaught error: ', error);
  }
});

httpServer.listen(8000);
