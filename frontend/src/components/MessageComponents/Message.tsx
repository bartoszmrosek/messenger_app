import React from 'react';
import useMedia from '../../hooks/useMedia';
import SvgIcons from '../SvgIcons';

interface MessageProps {
  isOnLeftSide: boolean;
  message: string;
}

const Message = ({ isOnLeftSide, message }: MessageProps) => {
  const media = useMedia();
  return (
    <div
      className={`grid grid-flow-col items-center w-full h-16  ${
        isOnLeftSide ? 'justify-start self-start' : 'justify-end self-end'
      }
      `}
    >
      {isOnLeftSide && (
        <section className="w-12 h-12 flex flex-col order-2">
          <SvgIcons type="user" className="w-12 h-12" />
        </section>
      )}
      <section
        className={`px-5 py-3 rounded-full ${
          isOnLeftSide
            ? 'order-3 bg-[#bcbfc3] text-[#371965]'
            : 'order-1 bg-main-purple text-white'
        } ${media === 'sm' ? 'mr-2' : 'mr-5'}`}
      >
        {message}
      </section>
    </div>
  );
};

export default Message;
