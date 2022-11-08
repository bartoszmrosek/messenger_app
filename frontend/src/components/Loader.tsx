import React from 'react';
import SvgIcons from './SvgIcons';

const Loader = ({ loadingMessage }: { loadingMessage: string }) => {
  return (
    <div className="min-h-full w-full flex flex-col justify-self-center self-center items-center justify-center text-lg gap-5 z-30 pointer-events-none">
      <SvgIcons type="loading" className="animate-spin w-12 h-12" />
      {loadingMessage}
    </div>
  );
};

export default Loader;
