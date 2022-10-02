import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../Contexts/SocketContext';
import { standardDbResponse } from '../interfaces/dbResponsesInterface';
import useErrorType from '../hooks/useErrorType';

import type { Socket } from 'socket.io-client';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../interfaces/socketContextInterfaces';
import InputForm from '../components/InputForm';
import AnimatedBlobs from '../components/AnimatedBlobs';

interface userInput {
  username: string;
  email: string;
  password: string;
}

const RegisterUserForm = () => {
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<userInput>();
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

  useEffect(() => {
    const wobblyInterval = setInterval(() => {
      const wobblyElems = document.querySelectorAll<HTMLElement>('.wobbly');
      let tl, tr, br, bl;
      let max = 200,
        min = 350;
      wobblyElems.forEach(elem => {
        tl = Math.floor(Math.random() * (max - min) + min);
        tr = Math.floor(Math.random() * (max - min) + min);
        br = Math.floor(Math.random() * (max - min) + min);
        bl = Math.floor(Math.random() * (max - min) + min);

        let borderRadius = `${tl}px ${tr}px ${br}px ${bl}px `;
        elem.style.borderRadius = borderRadius;
      });
    }, 5000);
    return () => {
      clearInterval(wobblyInterval);
    };
  });

  return (
    <div className="flex items-center justify-center h-screen w-screen absolute inset-0">
      <AnimatedBlobs />
      <form className="grid text-center gap-5 z-0 absolute font-medium px-12 py-8 md:px-16 md:py-12 lg:px-20 lg:py-16 border-2 border-gray-500/50 rounded-2xl">
        <p className="mb-5 font-bold text-2xl text-center">Registration</p>
        <Controller
          name="username"
          control={control}
          defaultValue=""
          rules={{ required: true, minLength: 1 }}
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            return (
              <InputForm
                value={value}
                onChange={onChange}
                error={error}
                type="text"
                inputName="username"
              />
            );
          }}
        />
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: true,
            minLength: 1,
            pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            return (
              <InputForm
                value={value}
                onChange={onChange}
                error={error}
                type="email"
                inputName="email"
              />
            );
          }}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: true, minLength: 1 }}
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            return (
              <InputForm
                value={value}
                onChange={onChange}
                error={error}
                type="password"
                inputName="password"
              />
            );
          }}
        />
        <button onClick={handleSubmit(onSubmit)}>Submit</button>
        {isSubmitSuccessfull && <p>Submit succesfull</p>}
        {error}
      </form>
    </div>
  );
};

export default RegisterUserForm;
