import { useState, useEffect } from 'react';

const useFetch = (initialUrl: string, initialParams = {}, skip = false) => {
  const [url, updateUrl] = useState(initialUrl);
  const [params, updateParams] =
    useState<Record<string, unknown>>(initialParams);
  const [data, setData] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = () =>
    setRefetchIndex(prevRefetchIndex => prevRefetchIndex + 1);

  useEffect(() => {
    (async () => {
      if (skip) return;
      setIsLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:3030${url}`);
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          setHasError(true);
          setErrorMessage(result);
        }
      } catch (err) {
        setHasError(true);
        setErrorMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [url, params, refetchIndex]);

  return {
    data,
    isLoading,
    hasError,
    errorMessage,
    updateUrl,
    updateParams,
    refetch,
  };
};

export default useFetch;
