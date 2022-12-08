import { useEffect, useState } from 'react';

const useRequestStatus = () => {
  const [countdownTrigger, setCountdownTrigger] = useState(false);
  const [countdownResults, setCountDownResults] = useState<string>(null);
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      if (countdownTrigger) {
        setCountDownResults(
          'Server request can take up to 5 minutes becouse of hobby server subscription',
        );
      }
    }, 10000);
    if (!countdownTrigger) {
      clearTimeout(startTimeout);
      setCountDownResults('');
    }
    return () => {
      clearTimeout(startTimeout);
    };
  }, [countdownTrigger]);
  return [countdownResults, setCountdownTrigger] as const;
};

export default useRequestStatus;
