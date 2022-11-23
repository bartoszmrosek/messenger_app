import React from 'react';
import useMedia from '../../hooks/useMedia';
import { MessageStatus } from '../../interfaces/MessageInterfaces';
import SvgIcons from '../SvgIcons';

interface MessageProps {
  isOnLeftSide: boolean;
  message: string;
  status?: MessageStatus;
  errorClickHandler?: () => Promise<void>;
}

const Message = ({
  isOnLeftSide,
  message,
  status,
  errorClickHandler,
}: MessageProps) => {
  const media = useMedia();
  return (
    <div
      className={`grid grid-flow-col items-center w-full h-max my-3 text-center  ${
        isOnLeftSide ? 'justify-start' : 'justify-end'
      }
      `}
      onClick={() => {
        status === 'error' && errorClickHandler();
      }}
    >
      {isOnLeftSide && (
        <section className="w-12 h-12 flex flex-col order-2">
          <SvgIcons type="user" className="w-12 h-12" />
        </section>
      )}
      <section
        className={`px-5 py-3 rounded-full break-normal h-auto min-w-[3rem] w-auto ${
          message.length > 30 &&
          'rounded-[3rem] max-w-[50%] overflow-hidden break-words'
        } ${isOnLeftSide ? 'justify-self-start' : 'justify-self-end'}
        ${
          isOnLeftSide
            ? 'order-3 bg-[#bcbfc3] text-[#371965]'
            : `order-1 bg-main-purple ${
                status === 'error' ? 'text-red-800' : 'text-white'
              }`
        } 
        ${media === 'sm' ? 'mr-3' : 'mr-5'}
        `}
      >
        {message}
      </section>
    </div>
  );
};

export default Message;
