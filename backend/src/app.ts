/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import 'dotenv/config';

import checkOrCreateUser from './utils/checkOrCreateUser';
import checkUserLoginData from './utils/checkUserLoginData';
import searchUser from './utils/searchUser';
import getLastestConnections from './utils/getUserLatestConnections';
import { DbQueries, userDetails } from './queries';
import authTokenMiddleware, {
  IGetUserAuth,
} from './middleware/authenticate.middleware';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import authSocketMiddleware from './middleware/authSocket.middleware';

export interface SocketWithUserAuth
  extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  user: userDetails;
}

const PORT = process.env.PORT || 3030;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN as string,
    credentials: true,
  },
});

const db = new DbQueries();

app.use(cors({ origin: process.env.CORS_ORIGIN as string, credentials: true }));
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
  //prettier-ignore
  const checkingAuth =
  (typeof req.body.email === 'string' && typeof req.body.password === 'string'
      ? await checkUserLoginData(req.body, db)
      : 400);
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
      .cookie('token', newToken, {
        httpOnly: true,
        expires: date,
        sameSite: 'none',
        secure: true,
      })
      .send(checkingAuth.results);
  }
  if (typeof token === 'string') {
    try {
      return jwt.verify(
        token,
        process.env.SECRET_KEY as string,
        (err: Error, user: userDetails) => {
          if (err) {
            res.cookie('token', 'rubbish', { maxAge: 0 });
            throw 401;
          } else {
            return res.send(user);
          }
        },
      );
    } catch (err) {
      res.sendStatus(err);
    }
  }
  return res.sendStatus(checkingAuth);
});

app.get('/api/Search', authTokenMiddleware, async (req: IGetUserAuth, res) => {
  if (typeof req.query.username === 'string') {
    const queryRes = await searchUser(req.query.username, db);
    if (queryRes === 500) return res.sendStatus(500);
    return res.send(queryRes);
  }
  return res.sendStatus(400);
});

app.get(
  '/api/UserConnections',
  authTokenMiddleware,
  async (req: IGetUserAuth, res) => {
    return res.send(await getLastestConnections(req.user.user_id, db));
  },
);

app.get(
  '/api/ChatHistory',
  authTokenMiddleware,
  async (req: IGetUserAuth, res) => {
    console.log(req.query);
    if (typeof req.query.selectedChat === 'string') {
      const selectedChat = parseInt(req.query.selectedChat);
      return res.send(await db.getChatHistory(req.user.user_id, selectedChat));
    }
    return res.sendStatus(400);
  },
);

//Normal expressjs middleware doesn't work with sockets so this is custom made for this specific case
io.use(authSocketMiddleware);

io.on('connection', (socket: SocketWithUserAuth) => {
  socket.join(socket.user.user_id.toString());
});

httpServer.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
