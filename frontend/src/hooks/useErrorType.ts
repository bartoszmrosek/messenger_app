import React, { useState } from 'react';

/* 
    Error types are as following:
    0 - Error with connection to database
    1 - User already exists in database
    2 - User informations are wrong
*/

const useErrorType = () => {
  const [errorType, setErrorType] = useState<string | null>(null);
  const setError = (error: number | null | unknown) => {
    switch (error) {
      case 0:
        setErrorType('Cannot connect to database');
        break;
      case 1:
        setErrorType('User already exists');
        break;
      case 2:
        setErrorType('User login info is wrong');
        break;
      case null:
        setErrorType(null);
        break;
      default:
        setErrorType('Cannot connect to server');
        console.log(error);
        break;
    }
  };
  return [errorType, setError] as const;
};
export default useErrorType;
