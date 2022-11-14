import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useErrorType = () => {
  const [errorType, setErrorType] = useState<string | null>(null);
  const navigation = useNavigate();

  useEffect(() => {
    // This useEffect needs testing if actually works as expected
    const redirectionTimeout = setTimeout(() => {
      if (errorType === 'Login failed' || errorType === 'Unauthorized') {
        navigation('/Login', { state: { status: 'Session timed out' } });
      }
    }, 5000);
    return () => {
      clearTimeout(redirectionTimeout);
    };
  }, [errorType]);

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
