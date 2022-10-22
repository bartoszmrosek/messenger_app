import React, { useState, useContext, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useLocation } from 'react-router-dom';

import { SocketContext } from '../Contexts/SocketContext';
import { UserContext } from '../Contexts/UserContext';

import MessageSection from '../components/MessageComponents/MessageSection';
import UserConnections from '../components/MessageComponents/UserConnections';
import useErrorType from '../hooks/useErrorType';

import { standardDbResponse } from '../interfaces/dbResponsesInterface';
import { Socket } from 'socket.io-client';
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../interfaces/socketContextInterfaces';
import {
  userMessageInterface,
  UserContextExports,
} from '../Contexts/UserContext';
import Loader from '../components/Loader';
import ErrorDisplayer from '../components/ErrorDisplayer';

const Messeges = () => {
  const {
    loggedUser,
    userMessages,
    setMessagesFromHistory,
    handleNewMessage,
    connectingUserState,
  } = useContext(UserContext) as UserContextExports;
  const { isConnectingUser } = connectingUserState;
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [filteredMessages, setFilteredMessages] =
    useState<userMessageInterface[]>();
  const [groupedUsers, setGroupedUsers] = useState<userMessageInterface[]>();
  const [newMessageValue, setNewMessageValue] = useState<string>('');
  const [error, setError] = useErrorType();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retrySwtich, setRetrySwitch] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state }: any = useLocation();
  const date = new Date();

  useEffect(() => {
    if (loggedUser && isConnectingUser !== null && !isConnectingUser) {
      standardSocket
        .timeout(10000)
        .emit(
          'checkUserHistory',
          loggedUser.user_id,
          (
            connectionError: unknown,
            response: standardDbResponse<userMessageInterface[]>,
          ) => {
            setIsLoading(true);
            if (connectionError || response.type === 'error') {
              connectionError
                ? setError(connectionError)
                : setError(response.payload);
              setIsLoading(false);
            } else {
              setError(null);
              setMessagesFromHistory(response.payload);
              setIsLoading(false);
            }
          },
        );
    }

    if (state && state.activeChat) {
      setActiveChat(state.activeChat);
    }
  }, [isConnectingUser, retrySwtich]);

  useEffect(() => {
    if (activeChat) {
      setFilteredMessages(filterMessages(userMessages, activeChat));
    }
  }, [activeChat, userMessages]);

  useEffect(() => {
    const uniqueUser: string[] = [];
    if (userMessages !== undefined) {
      userMessages.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      const uniqueUsers = userMessages.filter(element => {
        const isDuplicate = uniqueUser.includes(element.username);
        if (loggedUser?.username !== element.username) {
          if (!isDuplicate) {
            uniqueUser.push(element.username);
            return true;
          }
        }
        return false;
      });
      setGroupedUsers(uniqueUsers);
    }
    standardSocket.on(
      'newMessageToClient',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newMessage: userMessageInterface, callback: any) => {
        callback(true);
        handleNewMessage(newMessage);
      },
    );
    return () => {
      standardSocket.off('newMessageToClient');
    };
  }, [userMessages]);

  const filterMessages = (
    messages: userMessageInterface[],
    activeChat: number,
  ) => {
    return messages.filter(message => {
      if (
        (activeChat === message.sender_user_id &&
          loggedUser?.user_id === message.reciever_user_id) ||
        (activeChat === message.reciever_user_id &&
          loggedUser?.user_id === message.sender_user_id)
      ) {
        return message;
      }
    });
  };

  const sendNewMessage = () => {
    if (newMessageValue.length > 0) {
      standardSocket.timeout(10000).emit(
        'newMessageToServer',
        {
          user_id: loggedUser?.user_id,
          username: loggedUser?.username,
          message: newMessageValue,
          sender_user_id: loggedUser?.user_id,
          reciever_user_id: activeChat,
          is_read: false,
          created_at: `${date.toISOString()}`,
        },
        (error: unknown, response: standardDbResponse<string | number>) => {
          if (
            error ||
            response.type === 'error' ||
            typeof response.payload === 'number'
          ) {
            error ? setError(error) : setError(response.payload);
          } else {
            setError(null);
            setNewMessageValue(response.payload);
          }
        },
      );
      if (loggedUser && activeChat) {
        handleNewMessage({
          user_id: loggedUser?.user_id,
          username: loggedUser?.username,
          message: newMessageValue,
          sender_user_id: loggedUser?.user_id,
          reciever_user_id: activeChat,
          isRead: false,
          created_at: `${date.toISOString()}`,
          message_id: nanoid(),
        });
      }
    }
  };

  return (
    <>
      {isLoading && !error && <Loader loadingMessage="Loading..." />}
      {error && <ErrorDisplayer error={error} retrySwitch={setRetrySwitch} />}
      {!isLoading && !error && (
        <>
          {groupedUsers && (
            <UserConnections
              loggedUserId={loggedUser.user_id}
              groupedUsers={groupedUsers}
              handleChatChange={user_id => setActiveChat(user_id)}
            />
          )}
        </>
        //   {/* {activeChat && filteredMessages !== undefined && (
        //   <MessageSection
        //     filteredMessages={filteredMessages}
        //     handleInput={currInput =>
        //       setNewMessageValue(currInput.currentTarget.value)
        //     }
        //     newMessageValue={newMessageValue}
        //     sendNewMessage={sendNewMessage}
        //   />
        // )} */}
      )}
    </>
  );
};
export default Messeges;
