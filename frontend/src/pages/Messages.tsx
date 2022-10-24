import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SocketContext } from '../Contexts/SocketContext';
import {
  UserContext,
  userMessageInterface,
  UserContextExports,
} from '../Contexts/UserContext';
import UserConnections from '../components/MessageComponents/UserConnections';
import useErrorType from '../hooks/useErrorType';
import { standardDbResponse } from '../interfaces/dbResponsesInterface';
import { Socket } from 'socket.io-client';
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../interfaces/socketContextInterfaces';
import Loader from '../components/Loader';
import ErrorDisplayer from '../components/ErrorDisplayer';
import Chat from '../components/MessageComponents/Chat';
import useMedia from '../hooks/useMedia';

const Messeges = ({
  setRenderNavOnMobile,
}: {
  setRenderNavOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    loggedUser,
    userConnetions,
    setUserConnections,
    connectingUserState,
  } = useContext(UserContext) as UserContextExports;
  const { isConnectingUser } = connectingUserState;
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
  const [activeChat, setActiveChat] = useState<null | number>(null);
  const [currChat, setCurrChat] = useState<userMessageInterface[]>(null);
  const [error, setError] = useErrorType();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retrySwtich, setRetrySwitch] = useState<boolean>(false);
  const [shouldOpenMobileChat, setShouldOpenMobileChat] =
    useState<boolean>(false);
  const media = useMedia();
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
              setUserConnections(prev => {
                const onlyNullMessages = prev.filter(message => {
                  return message.message === null ? true : false;
                });
                return [...onlyNullMessages, ...response.payload];
              });
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
        if (activeChat === newMessage.sender_user_id)
          setCurrChat(messages => [...messages, newMessage]);
      },
    );
    return () => {
      standardSocket.off('newMessageToClient');
    };
  }, [userConnetions]);

  const handleChatChange = chatNum => {
    setActiveChat(chatNum);
    if (media === 'sm') {
      setShouldOpenMobileChat(true);
      setRenderNavOnMobile(false);
    }
  };

  return (
    <>
      {isLoading && !error && <Loader loadingMessage="Loading..." />}
      {error && <ErrorDisplayer error={error} retrySwitch={setRetrySwitch} />}
      {!isLoading && !error && (
        <div className="h-full w-full flex flex-row divide-x divide-slate-400 overflow-x-hidden overflow-hidden relative">
          {userConnetions && (
            <>
              <UserConnections
                loggedUserId={loggedUser.user_id}
                connections={userConnetions}
                handleChatChange={handleChatChange}
              />
              <Chat
                messages={currChat}
                setMessages={setCurrChat}
                selectedChat={activeChat}
                shouldOpenMobileVersion={shouldOpenMobileChat}
                setMobileVersionSwitch={setShouldOpenMobileChat}
                setRenderNavOnMobile={setRenderNavOnMobile}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};
export default Messeges;
