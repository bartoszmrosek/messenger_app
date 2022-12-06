import React, { useState, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext, UserContextExports } from '../Contexts/UserContext';
import UserConnections from '../components/MessageComponents/UserConnections';
import useErrorType from '../hooks/useErrorType';
import Loader from '../components/Loader';
import ErrorDisplayer from '../components/ErrorDisplayer';
import Chat from '../components/MessageComponents/Chat';
import useMedia from '../hooks/useMedia';
import { io, Socket } from 'socket.io-client';
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../interfaces/SocketEvents';
import { UserMessageInterface } from '../interfaces/MessageInterfaces';
import {
  MobileNavbarContext,
  MobileNavbarContextExports,
} from '../Contexts/MobileNavbarContext';

const Messeges = () => {
  const { loggedUser, userConnetions, setUserConnections } = useContext(
    UserContext,
  ) as UserContextExports;
  const { setIsMobileNavbar } = useContext(
    MobileNavbarContext,
  ) as MobileNavbarContextExports;
  const [error, setError] = useErrorType();
  const media = useMedia();
  // Tried making it anything other than any but react-router just isn't compatible with it unless I really complicate types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state }: any = useLocation();
  const [activeChat, setActiveChat] = useState<null | {
    userId: number;
    username: string;
  }>(null);
  const [currentChat, setCurrentChat] = useState<UserMessageInterface[]>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retrySwtich, setRetrySwitch] = useState<boolean>(false);
  const [shouldOpenMobileChat, setShouldOpenMobileChat] =
    useState<boolean>(false);
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents<true>
  > | null>(null);
  const dataSent = useRef(false);

  //Code only to make socket resistant to rerenders caused by other data states
  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents<true>> = io(
      import.meta.env.VITE_REST_ENDPOINT,
      {
        withCredentials: true,
      },
    );

    socket.on(
      'newMessageToClient',
      (message: UserMessageInterface, callback) => {
        handleNewConnectionMessage(message);
        if (
          activeChat === null ||
          activeChat.userId !== message.sender_user_id
        ) {
          return callback('delivered');
        }
        callback('read');
        return setCurrentChat(prev => [...prev, message]);
      },
    );

    socket.on('connect_error', err => {
      setError(err);
    });

    socket.on('reconnect', () => {
      setError(null);
    });

    setSocket(socket);
    return () => {
      socket.removeAllListeners();
      socket.close();
    };
  }, [loggedUser, activeChat]);

  // Specially for reason of displaying newest message in user connections
  const handleNewConnectionMessage = (message: UserMessageInterface) => {
    setUserConnections(connections => {
      //Checks if any of connections are already matching, if so returns index else null
      const toChangeIndex = connections.reduce(
        (acc: number | null, connection, index) => {
          if (
            (message.sender_user_id === connection.sender_user_id ||
              message.reciever_user_id === connection.sender_user_id) &&
            (message.reciever_user_id === connection.reciever_user_id ||
              message.sender_user_id === connection.reciever_user_id)
          ) {
            return index;
          }
          return acc;
        },
        null,
      );

      if (toChangeIndex === null) {
        return [message, ...connections];
      }
      return connections.map((connection, index) => {
        if (index === toChangeIndex) {
          return {
            ...connection,
            message: message.message,
            created_at: message.created_at,
            status: message.status,
            reciever_user_id: message.reciever_user_id,
            sender_user_id: message.sender_user_id,
          };
        }
        return connection;
      });
    });
  };

  useEffect(() => {
    if (currentChat !== null && currentChat.length > 0) {
      handleNewConnectionMessage(currentChat[currentChat.length - 1]);
    }
  }, [currentChat]);

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
        const result: UserMessageInterface[] = await response.json();
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
      setIsMobileNavbar(false);
    }
  };

  useEffect(() => {
    //Somewhat hacky way (via useRef.current field) to make sure this is only fired on first state change,
    if (userConnetions.length > 0 && socket && !dataSent.current) {
      const recievers = userConnetions.map(connection =>
        connection.reciever_user_id === loggedUser.user_id
          ? connection.sender_user_id
          : connection.reciever_user_id,
      );
      socket.emit('clientUpdateStatus', recievers, 'delivered');
      dataSent.current = true;
    }
  }, [userConnetions]);

  return (
    <>
      {isLoading && <Loader loadingMessage="Loading..." />}
      {error && !isLoading && (
        <ErrorDisplayer error={error} retrySwitch={setRetrySwitch} />
      )}
      {!isLoading && !error && (
        <div className="h-full w-full flex flex-row divide-x divide-slate-400 overflow-hidden absolute">
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
