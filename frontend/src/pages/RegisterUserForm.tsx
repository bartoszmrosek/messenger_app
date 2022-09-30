import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import React, { useContext, useEffect, useState } from 'react';
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
    <div className=" flex items-center justify-center h-screen w-screen absolute inset-0">
      <span className="relative h-full w-full overflow-hidden ">
        <span
          className="wobbly rounded-full bg-main-purple absolute
         h-[40rem] w-[40rem] translate-x-[-62%] translate-y-[-62%] lg:translate-x-[-50%] lg:translate-y-[-50%] animate-wobble0 ease-wobble
           duration-4000"
        ></span>
        <span
          className="wobbly rounded-full bg-main-purple absolute
         h-[40rem] w-[40rem] bottom-0 right-0 animate-wobble1 translate-x-[62%] translate-y-[62%] lg:translate-x-[50%] lg:translate-y-[50%] ease-wobble
          duration-4000"
        ></span>
      </span>
      <form className="grid text-center gap-5 z-0 absolute font-medium">
        <Controller name='username' control={control} defaultValue='' rules={{required: true}} render={()}/>
        <label className="block">
          <input
            className={`peer transition-all duration-500 p-3 rounded-md ring-offset-1 ring-gray-400/80
              ring-1 outline-offset-2 outline-3 ${
                errors.username
                  ? ' outline-red-600 ring-red-600'
                  : ' hover:ring-gray-600 focus:outline-main-purple/80'
              }`}
            type="text"
            {...register('username', {
              required: true,
              min: 1,
            })}
            name="username"
          />
          <span
            className={`transtion-all duration-500 absolute left-3 top-3
            ${
              errors.username
                ? 'text-red-600 translate-x-[-12.5%] translate-y-[-100%] scale-[85%] px-1'
                : 'text-black/50 peer-focus:text-main-purple'
            }
            pointer-events-none
           peer-focus:scale-[85%] peer-focus:translate-x-[-12.5%] peer-focus:translate-y-[-100%]
            bg-white rounded-full peer-focus:px-1 `}
          >
            {!errors.username ? 'Username' : 'Field is required'}
          </span>
        </label>
        <button onClick={handleSubmit(onSubmit)}>Submit</button>
        {isSubmitSuccessfull && <p>Submit succesfull</p>}
        {error !== null && <ErrorOverlay error={error} />}
      </form>
    </div>
  );
};

export default RegisterUserForm;
