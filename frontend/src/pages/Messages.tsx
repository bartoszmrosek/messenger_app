import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { SocketContext } from '../Contexts/SocketContext';
import { UserContext } from '../Contexts/UserContext';

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
    userConnetions,
    setUserConnections,
    connectingUserState,
  } = useContext(UserContext) as UserContextExports;
  const { isConnectingUser } = connectingUserState;
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [currChatHistory, setCurrChatHistory] = useState<
    userMessageInterface[] | null
  >(null);
  const [error, setError] = useErrorType();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retrySwtich, setRetrySwitch] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state }: any = useLocation();

  // Specially for reason of displaying newest message in user connections
  const handleNewConnectionMessage = (message: userMessageInterface) => {
    setUserConnections(connections => {
      const filteredConnections = connections.filter(connection => {
        return connection.username !== message.username;
      });
      return [message, ...filteredConnections];
    });
  };

  useEffect(() => {
    if (loggedUser && isConnectingUser !== null && !isConnectingUser) {
      standardSocket
        .timeout(10000)
        .emit(
          'checkUserConnetions',
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
              setUserConnections(response.payload);
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
    standardSocket.on(
      'newMessageToClient',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newMessage: userMessageInterface, callback: any) => {
        callback(true);
        handleNewConnectionMessage(newMessage);
      },
    );
    return () => {
      standardSocket.off('newMessageToClient');
    };
  }, [userConnetions]);

  return (
    <>
      {isLoading && !error && <Loader loadingMessage="Loading..." />}
      {error && <ErrorDisplayer error={error} retrySwitch={setRetrySwitch} />}
      {!isLoading && !error && (
        <>
          {userConnetions && (
            <UserConnections
              loggedUserId={loggedUser.user_id}
              connections={userConnetions}
              handleChatChange={user_id => setActiveChat(user_id)}
            />
          )}
        </>
      )}
    </>
  );
};
export default Messeges;
