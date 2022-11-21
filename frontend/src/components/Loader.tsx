import React, { useEffect } from 'react';
import useRequestStatus from '../hooks/useRequestStatus';
import SvgIcons from './SvgIcons';

const Loader = ({ loadingMessage }: { loadingMessage: string }) => {
  const [longRequestTimeInfo, startRequestTimer] = useRequestStatus();
  useEffect(() => {
    startRequestTimer(true);
    return () => {
      startRequestTimer(false);
    };
  }, []);
  return (
    <div className="min-h-full w-full flex flex-col justify-self-center self-center items-center justify-center text-lg gap-5 z-30 pointer-events-none">
      <SvgIcons type="loading" className="animate-spin w-12 h-12" />
      <p>{loadingMessage}</p>
      {longRequestTimeInfo}
    </div>
  );
};

export default Loader;
