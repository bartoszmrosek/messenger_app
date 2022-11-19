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
      className={`grid grid-flow-col items-center w-full h-16  ${
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
      {/* Just a placholder down here */}
      <section
        className={`px-5 py-3 rounded-full 
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
