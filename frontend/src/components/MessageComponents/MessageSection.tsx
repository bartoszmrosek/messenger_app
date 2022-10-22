import React from 'react';
import Message from './Message';
import { userMessageInterface } from '../../Contexts/UserContext';

interface MessageSectionInterface {
  filteredMessages: userMessageInterface[];
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
                key={message.message_id}
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
