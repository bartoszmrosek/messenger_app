import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { UserDetails, MySqlConnetion } from './queries';
import authTokenMiddleware, {
  IGetUserAuth,
} from './middleware/authenticate.middleware';
import authSocketMiddleware from './middleware/authSocket.middleware';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from './interfaces/SocketEvents';
import saveNewMessage from './utils/saveNewMessage';
import { Users } from './controllers/Users';

export interface SocketWithUserAuth
  extends Socket<
    ClientToServerEvents,
    ServerToClientEvents<true>,
    never,
    never
  > {
  user: UserDetails;
}

const PORT = process.env.PORT || 3030;
const router = express();
const httpServer = createServer(router);

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://emotekpl-messenger-dev.netlify.app',
    'https://emotekpl-messenger-prod.netlify.app',
  ],
  credentials: true,
};

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents<true>,
  never,
  never
>(httpServer, {
  cors: corsOptions,
});

// Making one and only source of connections and truths to make things easier to manage
const UsersController = new Users();

router.use(cors(corsOptions));
router.use(cookieParser());
router.use(express.json());

router.post('/api/Register', async (req, res) =>
  UsersController.registerUser(req, res),
);

router.post('/api/Login', async (req, res) =>
  UsersController.loginUser(req, res),
);

router.get('/api/Search', authTokenMiddleware, async (req: IGetUserAuth, res) =>
  UsersController.searchUser(req, res),
);

router.get(
  '/api/UserConnections',
  authTokenMiddleware,
  async (req: IGetUserAuth, res) => UsersController.getUserHistory(req, res),
);

router.get(
  '/api/ChatHistory',
  authTokenMiddleware,
  async (req: IGetUserAuth, res) =>
    UsersController.getUserChatHistory(req, res, MySqlConnetion),
);

//Normal expressjs middleware doesn't work with sockets so this is custom made for this specific case
io.use(authSocketMiddleware);

io.on('connection', (socket: SocketWithUserAuth) => {
  socket.join(socket.user.user_id.toString());
  socket.on('newMessageToServer', async (message, callback) => {
    let isUserConnected: boolean;
    const iterableSidsMap = io.of('/').adapter.sids[Symbol.iterator]();
    for (const sid of iterableSidsMap) {
      if (isUserConnected) break;
      isUserConnected = sid[1].has(message.reciever_user_id.toString());
    }

    if (!isUserConnected) {
      const savingResults = await saveNewMessage(message, 'sent');
      callback(savingResults === null ? 'sent' : 'error');
    } else {
      socket
        .timeout(5000)
        .to(message.reciever_user_id.toString())
        .emit('newMessageToClient', message, async (err, status) => {
          if (err) return callback('error');
          const savingResults = await saveNewMessage(message, status[0]);
          if (savingResults === 500) return callback('error');
          return callback(status[0]);
        });
    }
  });

  socket.on('clientUpdateStatus', (recievers, status) => {
    const stringifiedRecievers = recievers.map(reciever => reciever.toString());
    socket
      .to(stringifiedRecievers)
      .emit('serverUpdateStatus', socket.user.user_id, status);
    void MySqlConnetion.updateMessageStatus(recievers, status);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
