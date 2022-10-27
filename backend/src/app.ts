/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import { Users } from './users';

import checkOrCreateUser from './utils/checkOrCreateUser';
import checkUserLoginData from './utils/checkUserLoginData';
import searchUser from './utils/searchUser';
import getLastestConnections from './utils/getUserLatestConnections';
import handleNewMessage from './utils/handleNewMessage';
import { DbQueries, newMessage, userDetails } from './queries';
import 'dotenv/config';
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

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
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

app.post('/api/Login', async (req, res) => {
  const token: unknown = req.cookies.token;
  if (typeof token === 'string') {
    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      async (err: Error, user: userDetails) => {
        console.log(err, user);
        if (err) return res.send(401);
        res.send(user);
      },
    );
  } else {
    const checkingAuth = await checkUserLoginData(req.body, db);
    if (typeof checkingAuth === 'object') {
      const newToken = jwt.sign(
        checkingAuth.results,
        process.env.SECRET_KEY as string,
        { expiresIn: '30m' },
      );
      res.cookie('token', newToken).send(checkingAuth.results);
    } else {
      res.sendStatus(checkingAuth);
    }
  }
});

io.on('connection', socket => {
  try {
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
