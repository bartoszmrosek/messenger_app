import React from 'react';
import useMedia from '../../hooks/useMedia';
import SvgIcons from '../SvgIcons';

interface MessageProps {
  isOnLeftSide: boolean;
  username: string;
  message: string;
}

const Message = ({ isOnLeftSide, username, message }: MessageProps) => {
  return (
    <div
      className={`grid grid-flow-col items-center w-full h-16 ${
        isOnLeftSide ? 'justify-start self-start' : 'justify-end self-end'
      }`}
    >
      <section className="w-12 h-12 flex flex-col order-2">
        <SvgIcons type="user" className="w-12 h-12" />
      </section>
      <section className={`${isOnLeftSide ? 'order-3' : 'order-1'}`}>
        {message}
      </section>
    </div>
  );
};

export default Message;
