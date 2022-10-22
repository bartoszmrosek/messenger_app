import React from 'react';
import SvgIcons from './SvgIcons';

const Loader = ({ loadingMessage }: { loadingMessage: string }) => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center translate-y-[-5%] text-lg gap-5">
      <SvgIcons type="loading" className="animate-spin w-12 h-12" />
      {loadingMessage}
    </div>
  );
};

export default Loader;
