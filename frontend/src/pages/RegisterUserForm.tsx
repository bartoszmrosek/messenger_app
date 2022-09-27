import { useForm, SubmitHandler } from 'react-hook-form';
import React, { useContext, useState } from 'react';
import { SocketContext } from '../Contexts/SocketContext';
import { standardDbResponse } from '../interfaces/dbResponsesInterface';
import ErrorOverlay from '../components/ErrorOverlay';
import useErrorType from '../hooks/useErrorType';
import { motion } from 'framer-motion';

import type { Socket } from 'socket.io-client';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../interfaces/socketContextInterfaces';

interface userInput {
  username: string;
  email: string;
  password: string;
}

const RegisterUserForm = () => {
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
  const { register, handleSubmit } = useForm<userInput>();
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState<
    boolean | null
  >(null);
  const [error, setError] = useErrorType();

  const onSubmit: SubmitHandler<userInput> = data => {
    standardSocket
      .timeout(10000)
      .emit(
        'checkOrCreateUser',
        { data },
        (error: unknown, dbResponse: standardDbResponse<null | number>) => {
          if (error) {
            setError(error);
          } else {
            if (dbResponse.type === 'confirm') {
              setError(null);
              setIsSubmitSuccessfull(true);
            } else {
              setIsSubmitSuccessfull(false);
              setError(dbResponse.payload);
            }
          }
        },
      );
  };

  return (
    <motion.div className=" flex items-center justify-center h-screen w-screen absolute inset-0">
      <form className="grid text-center gap-5">
        <label className="">
          Username
          <input
            className="grid text-center"
            type="text"
            {...register('username', {
              required: 'username is required',
              minLength: 1,
            })}
            name="username"
            placeholder="Username"
          />
        </label>
        <label className="">
          Email
          <input
            className="grid text-center"
            type="email"
            {...register('email', { required: 'email is required' })}
            name="email"
            placeholder="Email"
          />
        </label>
        <label className="">
          Password
          <input
            className="grid text-center"
            type="password"
            {...register('password', { required: 'password is required' })}
            name="password"
            placeholder="Password"
          />
        </label>
        <button onClick={handleSubmit(onSubmit)}>Submit</button>
        {isSubmitSuccessfull && <p>Submit succesfull</p>}
      </form>
      {error !== null && <ErrorOverlay error={error} />}
    </motion.div>
  );
};

export default RegisterUserForm;
