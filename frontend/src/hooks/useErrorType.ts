import { useState } from 'react';

/* 
    Error types are as following:
    0 - Error with connection to database
    1 - User already exists in database
    2 - Login failed
    3 - User does not exist or informations are wrong
    4 - Server couldn't save message to database, 
    although it still can process informations in real time
    5 - User doesn't have authorization for this action
*/

const useErrorType = () => {
  const [errorType, setErrorType] = useState<string | null>(null);
  const setError = (error: number | null | unknown | string) => {
    switch (error) {
      case 0:
        setErrorType('Cannot connect to database');
        break;
      case 4:
        setErrorType(
          'User message cannot be saved, you still can communicate in real time',
        );
        break;
      case 409:
        setErrorType('User already exists');
        break;
      case 400:
        setErrorType('Bad request');
        break;
      case 401:
        setErrorType('Login failed');
        break;
      case 403:
        setErrorType('Unauthorized');
        break;
      case 500:
        setErrorType('Server internal error');
        break;
      case null:
        setErrorType(null);
        break;
      default:
        if (error instanceof Error) {
          error.name === 'AbortError'
            ? setErrorType(null)
            : setErrorType('Connection timeout');
          break;
        }
        setErrorType('Cannot connect to server');
        break;
    }
  };
  return [errorType, setError] as const;
};
export default useErrorType;
