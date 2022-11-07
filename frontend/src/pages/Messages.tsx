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
import { io } from 'socket.io-client';

const Messeges = ({
  setRenderNavOnMobile,
}: {
  setRenderNavOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { loggedUser, userConnetions, setUserConnections } = useContext(
    UserContext,
  ) as UserContextExports;
  const [activeChat, setActiveChat] = useState<null | number>(null);
  const [currentChat, setCurrentChat] = useState<userMessageInterface[]>(null);
  const [error, setError] = useErrorType();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retrySwtich, setRetrySwitch] = useState<boolean>(false);
  const [shouldOpenMobileChat, setShouldOpenMobileChat] =
    useState<boolean>(false);
  const media = useMedia();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state }: any = useLocation();
  const socket = io(import.meta.env.VITE_REST_ENDPOINT, {
    withCredentials: true,
  });

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
    if (state && state.activeChat && state.from) {
      if (state.from === '/SearchResultsPage') {
        setActiveChat(state.activeChat);
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
        setUserConnections(result);
        setIsLoading(false);
      } catch (err) {
        if (!signal.aborted) {
          setIsLoading(false);
          setError(err);
        }
      }
      socket.on('connect_error', err => {
        setError(err);
      });
    })();
    return () => {
      socket.close();
      controller.abort();
      socket.removeAllListeners();
    };
  }, [retrySwtich]);

  const handleChatChange = (chatNum: number) => {
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
                updateConnectionMessage={handleNewConnectionMessage}
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
