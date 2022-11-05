import React from 'react';
import SvgIcons from './SvgIcons';

interface ErrorDisplayerProps {
  error: string;
  retrySwitch: React.Dispatch<React.SetStateAction<boolean>>;
}

const ErrorDisplayer = ({ error, retrySwitch }: ErrorDisplayerProps) => {
  return (
    <div className="h-full w-full flex flex-col justify-self-center self-center justify-center items-center text-red-600 font-bold text-2xl">
      <div className="flex flex-row justify-evenly items-center">
        <SvgIcons type="error" />
        <p className="mx-5 text-center">{error}</p>
        <SvgIcons type="error" />
      </div>
      <button
        onClick={() => retrySwitch(prev => !prev)}
        className="flex justify-center items-center px-5 py-2 m-3 rounded-2xl bg-red-600 text-porcelain hover:opacity-90"
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorDisplayer;
