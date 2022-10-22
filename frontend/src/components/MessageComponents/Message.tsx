import React from 'react';

const Message = ({
  message,
}: {
  message: string | null;
  isRecieved: boolean;
}) => {
  return <div>{message}</div>;
};
export default Message;
