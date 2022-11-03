/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/naming-convention */
import { nanoid } from 'nanoid';

import { Users } from '../users';
import type { Server } from 'socket.io';
import { DbQueries, newMessage } from '../queries';

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  newMessageToClient: (
    d: any,
    callback: (error: unknown, isRecieved: boolean) => void,
  ) => void;
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
  data: newMessage,
  callback: any,
  db: DbQueries,
  users: Users,
) => {
  const stateOfRecieverUser = users.checkIsUserConnected(data.reciever_user_id);
  const {
    created_at,
    is_read,
    message,
    reciever_user_id,
    sender_user_id,
    username,
  } = data;
  try {
    const savingStatus = await db.saveNewMessage(data);
    if (savingStatus !== null) {
      callback({ type: 'error', payload: savingStatus });
    }
  } catch (err) {
    console.log('[utils][handleNewMessage] error: ', err);
    callback({
      type: 'error',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      payload: err,
    });
  }
  if (stateOfRecieverUser !== 'Not connected') {
    io.timeout(10000)
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
            if (isRecieved) {
              callback({
                type: 'confirm',
                payload: 'delivered',
              });
            } else {
              callback({
                type: 'confirm',
                payload: 'sent',
              });
            }
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
