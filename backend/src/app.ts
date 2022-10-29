/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import ms from 'ms';

import { Users } from './users';

import checkOrCreateUser from './utils/checkOrCreateUser';
import checkUserLoginData from './utils/checkUserLoginData';
import searchUser from './utils/searchUser';
import getLastestConnections from './utils/getUserLatestConnections';
import handleNewMessage from './utils/handleNewMessage';
import { DbQueries, newMessage, userDetails } from './queries';
import 'dotenv/config';
import authTokenMiddleware, {
  IGetUserAuth,
} from './middleware/authenticate.middleware';

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
    return res.sendStatus(resCode);
  }
  return res.sendStatus(400);
});

app.post('/api/Login', async (req, res) => {
  const token: unknown = req.cookies.token;
  const checkingAuth =
    typeof req.body.email === 'string' && typeof req.body.email === 'string'
      ? await checkUserLoginData(req.body, db)
      : 400;
  if (typeof checkingAuth === 'object') {
    const newToken = jwt.sign(
      checkingAuth.results,
      process.env.SECRET_KEY as string,
      { expiresIn: '30m' },
    );
    const date = new Date();
    const now = date.getTime();
    const expire = now + ms('30m');
    date.setTime(expire);
    return res
      .cookie('token', newToken, { httpOnly: true, expires: date })
      .send(checkingAuth.results);
  }
  if (typeof token === 'string') {
    return jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      async (err: Error, user: userDetails) => {
        if (err) {
          res.cookie('token', 'rubbish', { maxAge: 0 });
          return res.sendStatus(401);
        } else {
          return res.send(user);
        }
      },
    );
  }
  return res.sendStatus(checkingAuth);
});

app.get('/api/Search', authTokenMiddleware, async (req: IGetUserAuth, res) => {
  if (typeof req.query.username === 'string') {
    const queryRes = await searchUser(req.query.username, db);
    if (queryRes === 500) return res.sendStatus(500);
    return res.send(queryRes);
  }
  return 400;
});

io.on('connection', socket => {
  try {
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
