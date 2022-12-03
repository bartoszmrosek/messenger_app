import React from 'react';
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
  const checkStatusForSvg = () => {
    switch (status) {
      case 'sent':
        return <SvgIcons type="status-sent" />;
      case 'sending':
        return <SvgIcons type="status-sending" />;
      case 'delivered':
        return <SvgIcons type="status-delivered" />;
      case 'read':
        return <SvgIcons type="user" className="h-6 w-6" />;
    }
  };

  return (
    <div
      className={`grid ${
        isOnLeftSide ? 'grid-flow-col my-3' : 'grid-col-row'
      } items-center w-full h-max text-center  ${
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
        className={`relative mr-5 px-5 py-3 rounded-full break-normal h-auto min-w-[3rem] w-auto ${
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
        `}
      >
        {message}
      </section>
      {!isOnLeftSide && (
        <div
          className={`${
            status === 'read' ? 'w-6 h-6' : 'w-4 h-4'
          } order-4 justify-self-end`}
        >
          {checkStatusForSvg()}
        </div>
      )}
    </div>
  );
};

export default Message;
