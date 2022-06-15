import React, { useState, useContext, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useLocation } from 'react-router-dom';
import { SocketContext } from '../Contexts/SocketContext';
import { UserContext } from '../Contexts/UserContext';
import type {
  userMessagesTypes,
  exportUserContextTypes,
} from '../Contexts/UserContext';
import MessageSection from '../components/MessageSection';
import UserActiveChats from '../components/UserActiveChats';

interface newMessage {
  username: string;
  message: string;
  sender_user_id: number;
  reciever_user_id: number;
  is_read: boolean;
  created_at: string;
}

const Messeges = () => {
  const {
    userInformations,
    userMessages,
    getAndSetMessagesFromHistory,
    handleNewMessage,
  }: exportUserContextTypes = useContext(UserContext);
  const { standardSocket }: any = useContext(SocketContext);
  const [activeChat, setActiveChat] = useState<number>();
  const [filteredMessages, setFilteredMessages] =
    useState<userMessagesTypes[]>();
  const [groupedUsers, setGroupedUsers] = useState<userMessagesTypes[]>();
  const [newMessageValue, setNewMessageValue] = useState<string>('');
  const { state }: any = useLocation();

  useEffect(() => {
    if (userInformations?.user_id !== undefined) {
      standardSocket.emit(
        'checkUserHistory',
        userInformations.user_id,
        (response: any[] | 'error') => {
          if (response === 'error') {
            console.log(response);
          } else {
            if (getAndSetMessagesFromHistory !== undefined) {
              getAndSetMessagesFromHistory(response);
            }
          }
        },
      );
    }
    if (state !== null && state.activeChat !== undefined) {
      setActiveChat(state.activeChat);
    }
  }, []);

  useEffect(() => {
    if (activeChat !== undefined) {
      if (userMessages !== undefined) {
        setFilteredMessages(filterMessages(userMessages, activeChat));
      }
    }
  }, [activeChat, userMessages]);

  useEffect(() => {
    const uniqueUser: any[] = [];
    if (userMessages !== undefined) {
      const uniqueUsers = userMessages.filter(element => {
        const isDuplicate = uniqueUser.includes(element.username);
        if (userInformations?.username !== element.username) {
          if (!isDuplicate) {
            uniqueUser.push(element.username);
            return true;
          }
        }
        return false;
      });
      setGroupedUsers(uniqueUsers);
    }
  }, [userMessages]);

  useEffect(() => {
    standardSocket.on('newMessageToClient', (newMessage: newMessage) => {
      if (handleNewMessage !== undefined) {
        handleNewMessage(newMessage);
      }
    });
    return () => {
      standardSocket.off('newMessageToClient');
    };
  }, [userMessages]);

  const handleChatChange = (user_id: number) => {
    setActiveChat(user_id);
  };

  const filterMessages = (
    messages: userMessagesTypes[],
    activeChat: number,
  ) => {
    return messages.filter(message => {
      if (
        (activeChat === message.sender_user_id &&
          userInformations?.user_id === message.reciever_user_id) ||
        (activeChat === message.reciever_user_id &&
          userInformations?.user_id === message.sender_user_id)
      ) {
        return message;
      }
    });
  };

  const handleInput = (inputValue: React.FormEvent<HTMLInputElement>) => {
    setNewMessageValue(inputValue.currentTarget.value);
  };

  const date = new Date();
  const sendNewMessage = () => {
    if (newMessageValue.length > 0) {
      standardSocket.emit(
        'newMessageToServer',
        {
          user_id: userInformations?.user_id,
          username: userInformations?.username,
          message: newMessageValue,
          sender_user_id: userInformations?.user_id,
          reciever_user_id: activeChat,
          is_read: false,
          created_at: `${date.toISOString()}`,
        },
        (ack: string) => {
          setNewMessageValue(ack);
        },
      );
      if (handleNewMessage !== undefined) {
        handleNewMessage({
          user_id: userInformations?.user_id,
          username: userInformations?.username,
          message: newMessageValue,
          sender_user_id: userInformations?.user_id,
          reciever_user_id: activeChat,
          isRead: false,
          created_at: `${date.toISOString()}`,
          message_id: nanoid(),
        });
      }
    }
  };

  const userToSendMessageTo = (userNode: userMessagesTypes): number => {
    if (userInformations?.user_id === userNode.reciever_user_id) {
      return userNode.sender_user_id;
    } else {
      return userNode.reciever_user_id;
    }
  };

  return (
    <div>
      {groupedUsers !== undefined && (
        <UserActiveChats
          groupedUsers={groupedUsers}
          handleChatChange={handleChatChange}
          userToSendMessageTo={userToSendMessageTo}
        />
      )}
      {activeChat !== undefined && filteredMessages !== undefined && (
        <MessageSection
          filteredMessages={filteredMessages}
          handleInput={handleInput}
          newMessageValue={newMessageValue}
          sendNewMessage={sendNewMessage}
        />
      )}
    </div>
  );
};
export default Messeges;
