import { nanoid } from 'nanoid';

import { checkIsUserConnected } from '../users';
import { saveNewMessageToDataBase } from '../dbHandler';

import type { Server } from 'socket.io';
import type { NewMessage } from '../dbHandler';

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

const handleNewMessage = async (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  data: NewMessage,
  callback: any,
) => {
  const stateOfRecieverUser = checkIsUserConnected(data.reciever_user_id);
  const {
    created_at,
    is_read,
    message,
    reciever_user_id,
    sender_user_id,
    username,
  } = data;
  try {
    await saveNewMessageToDataBase(data);
  } catch (error) {
    callback({
      type: 'error',
      payload: error,
    });
  }
  if (stateOfRecieverUser !== 'Not connected') {
    io.sockets
      .timeout(10000)
      .to(stateOfRecieverUser.socketId)
      .emit(
        'newMessageToClient',
        {
          username,
          sender_user_id,
          reciever_user_id,
          message,
          is_read,
          created_at,
          message_id: nanoid(),
        },
        (error: unknown, isRecieved: boolean) => {
          if (error) {
            callback({
              type: 'confirm',
              payload: 'sent',
            });
          } else {
            isRecieved
              ? callback({
                  type: 'confirm',
                  payload: 'delivered',
                })
              : callback({
                  type: 'confirm',
                  payload: 'sent',
                });
          }
        },
      );
  } else {
    callback({
      type: 'confirm',
      payload: 'sent',
    });
  }
};

export default handleNewMessage;
