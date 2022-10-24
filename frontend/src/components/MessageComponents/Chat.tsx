import React from 'react';
import { userMessageInterface } from '../../Contexts/UserContext';
import useMedia from '../../hooks/useMedia';
import SvgIcons from '../SvgIcons';

interface ChatProps {
  messages: userMessageInterface[] | null;
  setMessages: React.Dispatch<React.SetStateAction<userMessageInterface[]>>;
  selectedChat: number;
  shouldOpenMobileVersion: boolean;
  setMobileVersionSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  setRenderNavOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
}

const Chat = ({
  messages,
  setMessages,
  selectedChat,
  shouldOpenMobileVersion,
  setMobileVersionSwitch,
  setRenderNavOnMobile,
}: ChatProps) => {
  const media = useMedia();
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
        {media === 'sm' && (
          <section className="absolute inset-0 w-full h-fit flex flex-row p-3 bg-main-purple">
            <button onClick={handleMobileChatClose} className="basis-4">
              <SvgIcons type="arrow-left" className="w-12 h-12" />
            </button>
          </section>
        )}
        {renderedMessages()}
      </section>
    </>
  );
};

export default Chat;
