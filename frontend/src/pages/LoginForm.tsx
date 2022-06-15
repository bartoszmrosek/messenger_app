import React, { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SocketContext } from '../Contexts/SocketContext';
import { UserContext } from '../Contexts/UserContext';
import useErrorType from '../hooks/useErrorType';
import ErrorOverlay from '../components/ErrorOverlay';
import type { exportUserContextTypes } from '../Contexts/UserContext';
import type { standardDbResponse } from '../interfaces/dbResponsesInterface';

interface userInput {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { standardSocket }: any = useContext(SocketContext);
  const userSetter: exportUserContextTypes = useContext(UserContext);
  const { register, handleSubmit } = useForm<userInput>();
  const [error, setError] = useErrorType();

  const onSubmit: SubmitHandler<userInput> = data => {
    standardSocket.timeout(10000).emit(
      'checkUserLoginData',
      { data },
      (
        error: unknown,
        dbResponse: standardDbResponse<{
          user_id: number;
          username: string;
          email: string;
        }>,
      ) => {
        if (error) {
          setError(error);
        } else {
          if (dbResponse.type === 'confirm') {
            setError(null);
            const { payload } = dbResponse;
            if (userSetter.handleNewInformations !== undefined) {
              userSetter.handleNewInformations(
                payload.user_id,
                payload.username,
                payload.email,
              );
            }
          } else {
            setError(dbResponse.payload);
          }
        }
      },
    );
  };

  return (
    <>
      <form>
        <label>Email</label>
        <input
          type="email"
          {...register('email', { required: 'email is required' })}
          name="email"
          placeholder="email"
        />
        <label>Password:</label>
        <input
          type="password"
          {...register('password', { required: 'password is required' })}
          name="password"
          placeholder="password"
        />
        <button onClick={handleSubmit(onSubmit)}>Submit</button>
      </form>
      {error !== null && <ErrorOverlay error={error} />}
    </>
  );
};
export default LoginForm;
