import React, { useState, useContext, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useLocation } from 'react-router-dom';

import { SocketContext } from '../Contexts/SocketContext';
import { UserContext } from '../Contexts/UserContext';

import MessageSection from '../components/MessageSection';
import UserActiveChats from '../components/UserActiveChats';
import useErrorType from '../hooks/useErrorType';

import type { standardDbResponse } from '../interfaces/dbResponsesInterface';
import type { Socket } from 'socket.io-client';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../interfaces/socketContextInterfaces';
import {
  userMessageInterface,
  UserContextExports,
} from '../Contexts/UserContext';

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
    user,
    userMessages,
    getAndSetMessagesFromHistory,
    handleNewMessage,
  }: UserContextExports = useContext(UserContext);
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
  const [activeChat, setActiveChat] = useState<number>();
  const [filteredMessages, setFilteredMessages] =
    useState<userMessageInterface[]>();
  const [groupedUsers, setGroupedUsers] = useState<userMessageInterface[]>();
  const [newMessageValue, setNewMessageValue] = useState<string>('');
  const [error, setError] = useErrorType();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state }: any = useLocation();

  useEffect(() => {
    if (user?.user_id !== undefined) {
      standardSocket
        .timeout(10000)
        .emit(
          'checkUserHistory',
          user.user_id,
          (
            connectionError: unknown,
            response: standardDbResponse<userMessageInterface[]>,
          ) => {
            if (connectionError) {
              setError(connectionError);
            } else {
              if (response.type === 'error') {
                setError(response.payload);
              } else {
                setError(null);
                if (getAndSetMessagesFromHistory !== undefined) {
                  getAndSetMessagesFromHistory(response.payload);
                }
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
    const uniqueUser: string[] = [];
    if (userMessages !== undefined) {
      const uniqueUsers = userMessages.filter(element => {
        const isDuplicate = uniqueUser.includes(element.username);
        if (user?.username !== element.username) {
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
    standardSocket.on(
      'newMessageToClient',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newMessage: newMessage, callback: any) => {
        if (handleNewMessage !== undefined) {
          callback(true);
          handleNewMessage(newMessage);
        }
      },
    );
    return () => {
      standardSocket.off('newMessageToClient');
    };
  }, [userMessages]);

  const handleChatChange = (user_id: number) => {
    setActiveChat(user_id);
  };

  const filterMessages = (
    messages: userMessageInterface[],
    activeChat: number,
  ) => {
    return messages.filter(message => {
      if (
        (activeChat === message.sender_user_id &&
          user?.user_id === message.reciever_user_id) ||
        (activeChat === message.reciever_user_id &&
          user?.user_id === message.sender_user_id)
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
      standardSocket.timeout(10000).emit(
        'newMessageToServer',
        {
          user_id: user?.user_id,
          username: user?.username,
          message: newMessageValue,
          sender_user_id: user?.user_id,
          reciever_user_id: activeChat,
          is_read: false,
          created_at: `${date.toISOString()}`,
        },
        (
          error: unknown,
          messageStatus: standardDbResponse<string | number>,
        ) => {
          if (error) {
            setError(error);
          } else {
            if (
              messageStatus.type === 'error' ||
              typeof messageStatus.payload === 'number'
            ) {
              setError(messageStatus.payload);
            } else {
              setError(null);
              setNewMessageValue(messageStatus.payload);
            }
          }
        },
      );
      if (handleNewMessage !== undefined) {
        handleNewMessage({
          user_id: user?.user_id,
          username: user?.username,
          message: newMessageValue,
          sender_user_id: user?.user_id,
          reciever_user_id: activeChat,
          isRead: false,
          created_at: `${date.toISOString()}`,
          message_id: nanoid(),
        });
      }
    }
  };

  const userToSendMessageTo = (userNode: userMessageInterface): number => {
    if (user?.user_id === userNode.reciever_user_id) {
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
      {error}
    </div>
  );
};
export default Messeges;
