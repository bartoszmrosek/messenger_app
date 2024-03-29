import {
  MessageStatus,
  UserMessageInterface,
} from '../interfaces/MessageInterfaces';
import { NewMessage, MySqlConnetion } from '../queries';

const saveNewMessage = async (
  message: UserMessageInterface,
  statusOverride?: MessageStatus,
): Promise<500 | null> => {
  const strippedMessage: NewMessage = {
    reciever_user_id: message.reciever_user_id,
    sender_user_id: message.sender_user_id,
    message: message.message,
    status: statusOverride ? statusOverride : message.status,
  };
  const queryRes = await MySqlConnetion.saveNewMessage(strippedMessage);
  if (queryRes === 500) return 500;
  return null;
};

export default saveNewMessage;
