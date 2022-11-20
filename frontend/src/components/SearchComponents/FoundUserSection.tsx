import React from 'react';
import SvgIcons from '../SvgIcons';

interface FoundUserSectionProps {
  userId: number;
  username: string;
  handleClick: (userId: number, username: string) => void;
}

const FoundUserSection = ({
  userId,
  username,
  handleClick,
}: FoundUserSectionProps) => {
  return (
    <section className="last-of-type:mb-28 lg:last-of-type:mb-12 flex flex-row justify-between items-center w-full border-4 rounded-lg px-3">
      <span className="flex flex-row items-center justify-start gap-2">
        <SvgIcons type="user" className="h-16 w-16" />
        <h1 className="font-semibold capitalize break-words text-ellipsis">
          {username}
        </h1>
      </span>
      <button
        onClick={() => handleClick(userId, username)}
        className="rounded-3xl p-2 bg-main-purple text-porcelain break-keep"
      >
        Send message
      </button>
    </section>
  );
};

export default FoundUserSection;
