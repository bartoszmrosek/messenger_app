import React, { useState } from 'react';

/* 
    Error types are as following:
    0 - Error with connection to server
    1 - User already exists in database
*/

const useErrorType = () => {
  const [errorType, setErrorType] = useState<string | null>(null);
  const setError = (error: number | null) => {
    switch (error) {
      case 0:
        setErrorType('Cannot connect to database');
        break;
      case 1:
        setErrorType('User already exists');
        break;
      default:
        setErrorType('Cannot connect to server');
        break;
    }
  };
  return [errorType, setError] as const;
};
export default useErrorType;
