import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { UserContext, UserContextExports } from '../../Contexts/UserContext';
import useErrorType from '../../hooks/useErrorType';
import useMedia from '../../hooks/useMedia';
import ErrorDisplayer from '../ErrorDisplayer';
import Loader from '../Loader';
import SvgIcons from '../SvgIcons';
import Message from './Message';
import TextareaAutosize from 'react-textarea-autosize';
import { nanoid } from 'nanoid';
import moment from 'moment-timezone';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../interfaces/SocketEvents';
import { UserMessageInterface } from '../../interfaces/MessageInterfaces';
import {
  MobileNavbarContext,
  MobileNavbarContextExports,
} from '../../Contexts/MobileNavbarContext';

interface ChatProps {
  messages: UserMessageInterface[] | null;
  setMessages: React.Dispatch<React.SetStateAction<UserMessageInterface[]>>;
  selectedChat: { userId: number; username: string } | null;
  shouldOpenMobileVersion: boolean;
  setMobileVersionSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket<ServerToClientEvents, ClientToServerEvents<true>>;
}

const Chat = ({
  messages,
  setMessages,
  selectedChat,
  shouldOpenMobileVersion,
  setMobileVersionSwitch,
  socket,
}: ChatProps) => {
  const media = useMedia();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useErrorType();
  const [retrySwitch, setRetrySwitch] = useState(false);
  const { loggedUser } = useContext(UserContext) as UserContextExports;
  const { setIsMobileNavbar } = useContext(
    MobileNavbarContext,
  ) as MobileNavbarContextExports;
  const navigate = useNavigate();
  const [textAreaValue, setTextAreaValue] = useState('');
  // This normally would be useRef hook but due to how package works this is recommended from documentation
  const [ref, setRef] = useState<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLElement>();

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
          const result: UserMessageInterface[] = await response.json();
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

  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMobileChatClose = () => {
    setMobileVersionSwitch(false);
    setIsMobileNavbar(true);
  };

  const handleTextAreaChange = (
    event: React.FormEvent<HTMLTextAreaElement>,
  ) => {
    setTextAreaValue(event.currentTarget.value);
  };
  const expandFocusArea = () => {
    ref.focus();
  };

  const renderedMessages = () => {
    if (messages !== null && messages.length > 0 && selectedChat)
      return messages.map(message => {
        return (
          <Message
            key={message.message_id}
            isOnLeftSide={loggedUser.user_id !== message.sender_user_id}
            message={message.message}
            status={message.status}
            errorClickHandler={() => sendMessage(message.message_id, message)}
          />
        );
      });
    return (
      <p className="text-lg font-medium absolute w-fit h-fit inset-0 m-auto p-5">
        {(messages === null || messages.length === 0) && selectedChat
          ? 'It looks like you don`t have any messages yet!'
          : 'Select any user to open chat!'}
      </p>
    );
  };

  const sendMessage = async (
    id?: string | number,
    message?: UserMessageInterface,
  ) => {
    // This state managment needs to be rewritten to redux dispatches as soon as migrated, it is getting really complex with multiple status states
    if (!id) {
      id = nanoid();
      message = {
        message_id: id,
        message: textAreaValue,
        sender_user_id: loggedUser.user_id,
        reciever_user_id: selectedChat.userId,
        created_at: moment().tz('Europe/Warsaw').format(),
        status: 'sending',
      };
      // Push new message with previous state
      setMessages(prevMessages => [...prevMessages, message]);
    }

    //Change status to sending for specific message
    setMessages(messages =>
      messages.map(message =>
        message.message_id === id ? { ...message, status: 'sending' } : message,
      ),
    );

    socket.timeout(10000).emit('newMessageToServer', message, (err, arg) => {
      // Update message status with new status value
      setMessages(messages =>
        messages.map(message =>
          message.message_id === id
            ? { ...message, status: err ? 'error' : arg }
            : message,
        ),
      );
    });

    setTextAreaValue('');
  };

  return (
    <>
      <section
        className={`transition-all delay-250 absolute md:static
         ${shouldOpenMobileVersion ? 'translate-x-[0%]' : 'translate-x-[100%]'} 
         md:translate-x-[0%] flex flex-col w-full h-full max-w-full items-center isolate bg-porcelain text-center py-3 lg:p-3 lg:pr-0 justify-end`}
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
        {!isLoading && !error && (
          <>
            <section
              className={`relative h-full w-full overflow-y-auto overflow-x-hidden mt-20`}
              ref={scrollRef}
            >
              {renderedMessages()}
            </section>
            {selectedChat && messages && (
              <section
                className={`static border-none h-fit w-full text-[#371965] flex flex-row flex-grow-0 mt-2 self-end items-center`}
              >
                <section
                  className="flex flex-row flex-grow-0 w-full h-full overflow-x-hidden rounded-3xl py-1 pl-3 pr-0 m-2 bg-[#bcbfc3] overflow-y-hidden items-center cursor-text"
                  onClick={expandFocusArea}
                >
                  <TextareaAutosize
                    className="w-full h-16 p-2 max-h-30 outline-none overflow-y-scroll resize-none bg-inherit text-left scrollbar-thin scrollbar-thumb-[#717375] whitespace-pre-wrap break-words pr-3"
                    onChange={handleTextAreaChange}
                    value={textAreaValue}
                    placeholder="Aa"
                    maxRows={4}
                    ref={tag => setRef(tag)}
                  />
                  {/* There shouldn`t be any empty divs, but this is easier and less complicated option to push scrollbar to the left 
                      also makes it more compatible with multiple browsers and their versions
                  */}
                  <div className="w-5"></div>
                </section>
                <button
                  className={`rounded-full w-16 h-full p-2 hover:bg-black/20 ${
                    textAreaValue.length < 1 && 'hidden'
                  }`}
                  onClick={() => sendMessage()}
                >
                  <SvgIcons type="send" />
                </button>
              </section>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Chat;
