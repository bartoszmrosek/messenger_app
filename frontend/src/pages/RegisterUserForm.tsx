import { useForm, SubmitHandler } from 'react-hook-form';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { SocketContext } from '../Contexts/SocketContext';
import { standardDbResponse } from '../interfaces/dbResponsesInterface';
import ErrorOverlay from '../components/ErrorOverlay';
import useErrorType from '../hooks/useErrorType';

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
    <div className=" flex items-center justify-center h-screen w-screen absolute inset-0">
      <span className="relative h-full w-full overflow-hidden ">
        <div
          className="wobbly rounded-full bg-[#8A3FFC] absolute
         h-[40rem] w-[40rem] translate-x-[-62%] translate-y-[-62%] lg:translate-x-[-50%] lg:translate-y-[-50%] animate-wobble0 ease-wobble
           duration-4000"
        ></div>
        <div
          className="wobbly rounded-full bg-[#8A3FFC] absolute
         h-[40rem] w-[40rem] bottom-0 right-0 animate-wobble1 translate-x-[62%] translate-y-[62%] lg:translate-x-[50%] lg:translate-y-[50%] ease-wobble
          duration-4000"
        ></div>
      </span>
      <form className="grid text-center gap-5 z-0 absolute">
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
        {error !== null && <ErrorOverlay error={error} />}
      </form>
    </div>
  );
};

export default RegisterUserForm;
