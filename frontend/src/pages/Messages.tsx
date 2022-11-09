import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  UserContext,
  userMessageInterface,
  UserContextExports,
} from '../Contexts/UserContext';
import UserConnections from '../components/MessageComponents/UserConnections';
import useErrorType from '../hooks/useErrorType';
import Loader from '../components/Loader';
import ErrorDisplayer from '../components/ErrorDisplayer';
import Chat from '../components/MessageComponents/Chat';
import useMedia from '../hooks/useMedia';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

const Messeges = ({
  setRenderNavOnMobile,
}: {
  setRenderNavOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { loggedUser, userConnetions, setUserConnections } = useContext(
    UserContext,
  ) as UserContextExports;
  const [activeChat, setActiveChat] = useState<null | {
    userId: number;
    username: string;
  }>(null);
  const [currentChat, setCurrentChat] = useState<userMessageInterface[]>(null);
  const [error, setError] = useErrorType();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retrySwtich, setRetrySwitch] = useState<boolean>(false);
  const [shouldOpenMobileChat, setShouldOpenMobileChat] =
    useState<boolean>(false);
  const media = useMedia();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state }: any = useLocation();
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  //Code only to make socket resistant to rerenders caused by other data states
  useEffect(() => {
    const socket = io(import.meta.env.VITE_REST_ENDPOINT, {
      withCredentials: true,
    });
    socket.on(
      'newMessageToClient',
      (message: userMessageInterface, callback) => {
        callback({ status: 200 });
        if (activeChat.userId !== message.sender_user_id) {
          handleNewConnectionMessage(message);
        } else {
          setCurrentChat(prev => [...prev, message]);
        }
      },
    );

    socket.on('connect_error', err => {
      setError(err);
    });
    setSocket(socket);
    return () => {
      socket.removeAllListeners();
      socket.close();
    };
  }, [loggedUser]);

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
    if (state && state.activeChat && state.from && state.username) {
      if (state.from === '/SearchResultsPage') {
        setShouldOpenMobileChat(true);
        setActiveChat({ userId: state.activeChat, username: state.username });
      } else {
        setActiveChat(null);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REST_ENDPOINT}/api/UserConnections`,
          {
            signal,
            credentials: 'include',
          },
        );
        if (!response.ok) throw response.status;
        const result: [userMessageInterface] = await response.json();
        setError(null);
        setUserConnections(prev => {
          const onlyNullMessage = prev.filter(message => {
            return message.message === null;
          });
          return [...onlyNullMessage, ...result];
        });
        setIsLoading(false);
      } catch (err) {
        if (!signal.aborted) {
          setIsLoading(false);
          setError(err);
        }
      }
    })();
    return () => {
      controller.abort();
    };
  }, [retrySwtich]);

  const handleChatChange = (userToSendMessage: {
    userId: number;
    username: string;
  }) => {
    setActiveChat({
      userId: userToSendMessage.userId,
      username: userToSendMessage.username,
    });
    if (media === 'sm' || media === 'md') {
      setShouldOpenMobileChat(true);
      setRenderNavOnMobile(false);
    }
  };

  return (
    <>
      {isLoading && !error && <Loader loadingMessage="Loading..." />}
      {error && <ErrorDisplayer error={error} retrySwitch={setRetrySwitch} />}
      {!isLoading && !error && (
        <div className="h-screen w-screen flex flex-row divide-x divide-slate-400 overflow-x-hidden overflow-hidden relative">
          {userConnetions && (
            <>
              <UserConnections
                loggedUserId={loggedUser.user_id}
                connections={userConnetions}
                handleChatChange={handleChatChange}
              />
              <Chat
                messages={currentChat}
                setMessages={setCurrentChat}
                selectedChat={activeChat}
                shouldOpenMobileVersion={shouldOpenMobileChat}
                setMobileVersionSwitch={setShouldOpenMobileChat}
                setRenderNavOnMobile={setRenderNavOnMobile}
                socket={socket}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};
export default Messeges;
