import React, { useContext, useState } from 'react';
import { SocketContext } from '../Contexts/SocketContext';
import { UserContext } from '../Contexts/UserContext';
import { useForm, SubmitHandler } from 'react-hook-form';
import dbResponseHandler from '../DatabaseHandlers/dbResponse';
import type { exportUserContextTypes } from '../Contexts/UserContext';

interface userInput {
  email: string;
  password: string;
}
interface dbResponse {
  type: string;
  payload: {
    user_id: number;
    username: string;
    email: string;
    password: string;
  };
}

const LoginForm = () => {
  const { standardSocket }: any = useContext(SocketContext);
  const userSetter: exportUserContextTypes = useContext(UserContext);
  const [errorType, setErrorType] = useState('');
  const { register, handleSubmit } = useForm<userInput>();

  const onSubmit: SubmitHandler<userInput> = data => {
    standardSocket.emit(
      'checkUserLoginData',
      { data },
      (dbResponse: dbResponse) => {
        if (dbResponse.type === 'confirm') {
          setErrorType('');
          const { payload } = dbResponse;
          if (userSetter.handleNewInformations !== undefined) {
            userSetter.handleNewInformations(
              payload.user_id,
              payload.username,
              payload.email,
            );
          }
        } else {
          dbResponseHandler(dbResponse.type, setErrorType);
        }
      },
    );
  };

  return (
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
  );
};
export default LoginForm;
