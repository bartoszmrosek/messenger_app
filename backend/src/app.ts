/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { Users } from './users';

import checkOrCreateUser from './utils/checkOrCreateUser';
import checkUserLoginData from './utils/checkUserLoginData';
import searchUser from './utils/searchUser';
import getLastestConnections from './utils/getUserLatestConnections';
import handleNewMessage from './utils/handleNewMessage';
import {
  DbQueries,
  newMessage,
  userDetails,
  userLoginDetails,
} from './queries';
import authTokenMiddleware from './middleware/authenticate.middleware';

const PORT = process.env.PORT || 3030;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const db = new DbQueries();
const users = new Users();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/api/Register', async (req, res) => {
  if (
    typeof req.body.username === 'string' &&
    typeof req.body.email === 'string' &&
    typeof req.body.password === 'string'
  ) {
    const data: userDetails = req.body;
    const resCode = await checkOrCreateUser(data, db);
    res.sendStatus(resCode);
  } else {
    res.sendStatus(400);
  }
});

io.on('connection', socket => {
  try {
    socket.on(
      'checkUserLoginData',
      (payload: { data: userLoginDetails }, callback) => {
        const { data } = payload;
        void checkUserLoginData(data, callback, socket.id, db, users);
      },
    );

    socket.on('searchUser', (payload: string, callback) => {
      void searchUser(payload, callback, db);
    });

    socket.on('checkUserConnetions', (userId: number, callback: any) => {
      if (users.isUserAuthorized(userId, socket.id)) {
        void getLastestConnections(userId, callback, db);
      } else {
        callback({
          type: 'error',
          payload: 5,
        });
      }
    });

    socket.on(
      'newMessageToServer',
      async (payload: newMessage, callback: any) => {
        if (users.isUserAuthorized(payload.user_id, socket.id)) {
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument*/
          await handleNewMessage(io, payload, callback, db, users);
        } else
          callback({
            type: 'error',
            payload: 5,
          });
      },
    );

    socket.on('logoutUser', (userId: number) => {
      users.logoutUser(userId, socket.id);
    });

    socket.on('disconnect', () => {
      users.disconnectUser(socket.id);
    });
  } catch (error) {
    console.log('Uncaught error: ', error);
  }
});

httpServer.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
