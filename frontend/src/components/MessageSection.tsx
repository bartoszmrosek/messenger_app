import React from 'react';
import Message from './Message';
import type { userMessagesTypes } from '../Contexts/UserContext';

interface MessageSectionInterface {
  filteredMessages: userMessagesTypes[];
  handleInput: (inputValue: React.FormEvent<HTMLInputElement>) => void;
  newMessageValue: string;
  sendNewMessage: () => void;
}

const MessageSection = ({
  filteredMessages,
  handleInput,
  newMessageValue,
  sendNewMessage,
}: MessageSectionInterface) => {
  return (
    <div>
      {filteredMessages.length > 0 && (
        <div>
          {filteredMessages.map(message => {
            return (
              <Message
                key={message.created_at}
                message={message.message}
                isRecieved={false}
              />
            );
          })}
          <input
            name="newMessage"
            onChange={handleInput}
            value={newMessageValue}
          />
          <button onClick={sendNewMessage}>Send message</button>
        </div>
      )}
    </div>
  );
};

export default MessageSection;
