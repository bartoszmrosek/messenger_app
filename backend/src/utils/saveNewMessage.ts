import {
  MessageStatus,
  UserMessageInterface,
} from '../interfaces/MessageInterfaces';
import { DbQueries, NewMessage } from '../queries';

const saveNewMessage = async (
  message: UserMessageInterface,
  db: DbQueries,
  statusOverride?: MessageStatus,
): Promise<500 | null> => {
  const strippedMessage: NewMessage = {
    reciever_user_id: message.reciever_user_id,
    sender_user_id: message.sender_user_id,
    message: message.message,
    status: statusOverride ? statusOverride : message.status,
  };
  const queryRes = await db.saveNewMessage(strippedMessage);
  if (queryRes === 500) return 500;
  return null;
};

export default saveNewMessage;
