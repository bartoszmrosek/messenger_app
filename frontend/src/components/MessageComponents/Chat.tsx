import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import {
  UserContext,
  UserContextExports,
  userMessageInterface,
} from '../../Contexts/UserContext';
import useErrorType from '../../hooks/useErrorType';
import useMedia from '../../hooks/useMedia';
import ErrorDisplayer from '../ErrorDisplayer';
import Loader from '../Loader';
import SvgIcons from '../SvgIcons';
import Message from './Message';

interface ChatProps {
  messages: userMessageInterface[] | null;
  setMessages: React.Dispatch<React.SetStateAction<userMessageInterface[]>>;
  selectedChat: { userId: number; username: string } | null;
  shouldOpenMobileVersion: boolean;
  setMobileVersionSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  setRenderNavOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket;
}

const Chat = ({
  messages,
  setMessages,
  selectedChat,
  shouldOpenMobileVersion,
  setMobileVersionSwitch,
  setRenderNavOnMobile,
  socket,
}: ChatProps) => {
  const media = useMedia();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useErrorType();
  const [retrySwitch, setRetrySwitch] = useState(false);
  const { loggedUser } = useContext(UserContext) as UserContextExports;
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      if (selectedChat !== null && selectedChat !== undefined) {
        setIsLoading(true);
        //Cannot use finally, abort will trigger it as well and mess with loading state
        try {
          setError(null);
          const response = await fetch(
            `${
              import.meta.env.VITE_REST_ENDPOINT
            }/api/ChatHistory?selectedChat=${selectedChat.userId}`,
            {
              credentials: 'include',
              signal,
            },
          );
          if (!response.ok) throw response.status;
          const result: userMessageInterface[] = await response.json();
          setMessages(result);
          setIsLoading(false);
        } catch (err) {
          if (!signal.aborted) {
            if (err === 401) navigate('/Login');
            setError(err);
            setIsLoading(false);
          }
        }
      }
    })();
    return () => {
      controller.abort('abort on unmount');
    };
  }, [selectedChat, retrySwitch]);

  const renderedMessages = () => {
    if (messages !== null && messages.length > 0 && selectedChat)
      return messages.map(message => {
        return (
          <Message
            key={message.created_at}
            isOnLeftSide={loggedUser.user_id !== message.sender_user_id}
            message={message.message}
          />
        );
      });
    if ((messages === null || messages.length === 0) && selectedChat)
      return (
        <p className="text-lg font-medium">
          You don`t have any messages with this user yet!
        </p>
      );
    return <p className="text-lg font-medium">Select any user to open chat!</p>;
  };

  const handleMobileChatClose = () => {
    setMobileVersionSwitch(false);
    setRenderNavOnMobile(true);
  };

  const chatLocation = () => {
    return shouldOpenMobileVersion ? 'translate-x-[0%]' : 'translate-x-[100%]';
  };

  return (
    <>
      <section
        className={`transition-all delay-250 absolute md:static ${chatLocation()} md:translate-x-[0%] flex flex-col ${
          //prettier-ignore
          (messages !== null && messages.length > 0 && selectedChat)
            ? 'justify-end divide-y-4 divide-black/5'
            : 'justify-center'
        } h-full w-full items-center bg-porcelain text-center p-3`}
      >
        {isLoading && <Loader loadingMessage="Loading..." />}
        {error && <ErrorDisplayer error={error} retrySwitch={setRetrySwitch} />}
        {
          //prettier-ignore
          (media === 'sm' || media ==='md') && selectedChat && (
          <section className="absolute inset-0 w-full h-fit flex flex-col p-3 justify-center bg-main-purple z-50">
            <button
              onClick={handleMobileChatClose}
              className="flex flex-row gap-5"
            >
              <SvgIcons type="arrow-left" className="w-12 h-12" />
              <p className="justify-self-center self-center font-bold text-xl">
                {selectedChat.username}
              </p>
            </button>
          </section>
        )
        }
        {!isLoading && !error && renderedMessages()}
      </section>
    </>
  );
};

export default Chat;
