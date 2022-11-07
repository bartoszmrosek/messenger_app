import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { userMessageInterface } from '../../Contexts/UserContext';
import useErrorType from '../../hooks/useErrorType';
import useMedia from '../../hooks/useMedia';
import ErrorDisplayer from '../ErrorDisplayer';
import Loader from '../Loader';
import SvgIcons from '../SvgIcons';

interface ChatProps {
  messages: userMessageInterface[] | null;
  setMessages: React.Dispatch<React.SetStateAction<userMessageInterface[]>>;
  selectedChat: number;
  shouldOpenMobileVersion: boolean;
  setMobileVersionSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  setRenderNavOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
  updateConnectionMessage: (message: userMessageInterface) => void;
  socket: Socket;
}

const Chat = ({
  messages,
  setMessages,
  selectedChat,
  shouldOpenMobileVersion,
  setMobileVersionSwitch,
  setRenderNavOnMobile,
  updateConnectionMessage,
  socket,
}: ChatProps) => {
  const media = useMedia();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useErrorType();
  const [retrySwitch, setRetrySwitch] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      if (selectedChat !== null) {
        setIsLoading(true);
        try {
          setError(null);
          const response = await fetch(
            `${
              import.meta.env.VITE_REST_ENDPOINT
            }/api/ChatHistory?selectedChat=${selectedChat}`,
            {
              credentials: 'include',
              signal,
            },
          );
          if (!response.ok) throw response.status;
          console.log(await response.json());
          setIsLoading(false);
        } catch (err) {
          if (!signal.aborted) {
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

  const chatLocation = () => {
    if (shouldOpenMobileVersion) return 'translate-x-[0%]';
    return 'translate-x-[100%]';
  };

  const renderedMessages = () => {
    if (messages !== null && selectedChat !== null)
      return <section>Messages</section>;
    if (messages === null && selectedChat !== null)
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

  return (
    <>
      <section
        className={`transition-all delay-250 absolute md:static ${chatLocation()} md:translate-x-[0%] flex h-full w-full justify-center items-center bg-porcelain text-center p-3`}
      >
        {isLoading && <Loader loadingMessage="Loading..." />}
        {error && <ErrorDisplayer error={error} retrySwitch={setRetrySwitch} />}
        {media === 'sm' && (
          <section className="absolute inset-0 w-full h-fit flex flex-row p-3 bg-main-purple z-50">
            <button onClick={handleMobileChatClose} className="basis-4">
              <SvgIcons type="arrow-left" className="w-12 h-12" />
            </button>
          </section>
        )}
        {!isLoading && !error && renderedMessages()}
      </section>
    </>
  );
};

export default Chat;
