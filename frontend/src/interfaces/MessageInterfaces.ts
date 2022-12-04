export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error';

export interface UserMessageInterface {
  user_id?: number;
  message_id: number | string;
  username?: string;
  message: string | null;
  sender_user_id: number;
  reciever_user_id: number;
  status?: MessageStatus;
  isCompletlyNew?: boolean;
  errorHandler?: (id?: string, message?: UserMessageInterface) => Promise<void>;
  created_at: string | null;
}
