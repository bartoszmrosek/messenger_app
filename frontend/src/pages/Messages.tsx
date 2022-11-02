import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  UserContext,
  userMessageInterface,
  UserContextExports,
} from '../Contexts/UserContext';
import UserConnections from '../components/MessageComponents/UserConnections';
import useErrorType from '../hooks/useErrorType';
import { standardDbResponse } from '../interfaces/dbResponsesInterface';
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
  const [currChat, setCurrChat] = useState<userMessageInterface[]>(null);
  const [error, setError] = useErrorType();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retrySwtich, setRetrySwitch] = useState<boolean>(false);
  const [shouldOpenMobileChat, setShouldOpenMobileChat] =
    useState<boolean>(false);
  const media = useMedia();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state }: any = useLocation();
  console.log('Cookie:', document.cookie);
  const socket = io(import.meta.env.VITE_REST_ENDPOINT);

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
  }, [retrySwtich]);

  // useEffect(() => {
  //   standardSocket.on(
  //     'newMessageToClient',
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     (newMessage: userMessageInterface, callback: any) => {
  //       callback(true);
  //       handleNewConnectionMessage(newMessage);
  //       if (activeChat === newMessage.sender_user_id)
  //         setCurrChat(messages => [...messages, newMessage]);
  //     },
  //   );
  //   return () => {
  //     standardSocket.off('newMessageToClient');
  //   };
  // }, [userConnetions]);

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
