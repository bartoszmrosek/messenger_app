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
  const { handleSubmit, control } = useForm<userInput>();
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState<
    boolean | null
  >(null);
  const [error, setError] = useErrorType();
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [formStateResetSwitch, setFormStateResetSwitch] = useState(false);

  const onSubmit: SubmitHandler<userInput> = data => {
    setIsLoading(true);
    standardSocket
      .timeout(10000)
      .emit(
        'checkOrCreateUser',
        { data },
        (error: unknown, dbResponse: standardDbResponse<null | number>) => {
          setIsLoading(false);
          setFormStateResetSwitch(prev => !prev);
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

  useEffect(() => {
    const resetingFunction = setTimeout(() => {
      setError(null);
      setIsSubmitSuccessfull(null);
      setIsLoading(null);
    }, 4000);
    return () => {
      clearTimeout(resetingFunction);
    };
  }, [formStateResetSwitch]);

  const renderConditionalResults = () => {
    if (isLoading) {
      return (
        <>
          <svg
            className="animate-spin mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </>
      );
    } else {
      if (error) {
        return (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="align-middle overflow-hidden fill-transparent w-8 h-8 mr-3 animate-pulse"
              viewBox="0 0 1024 1024"
              version="1.1"
            >
              <path
                d="M512 981.333333C252.8 981.333333 42.666667 771.2 42.666667 512S252.8 42.666667 512 42.666667s469.333333 210.133333 469.333333 469.333333-210.133333 469.333333-469.333333 469.333333z m-50.432-326.101333L310.613333 504.32a32 32 0 0 0-45.226666 45.226667l174.72 174.762666a32.341333 32.341333 0 0 0 0.341333 0.341334l0.256 0.213333a32 32 0 0 0 50.048-6.144l337.450667-379.605333a32 32 0 1 0-47.872-42.496l-318.762667 358.613333z"
                fill="#8A3FFC"
              />
            </svg>
            Submit Succesfull
          </>
        );
      }
      if (isSubmitSuccessfull) {
        return (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="align-middle overflow-hidden fill-transparent w-8 h-8 mr-3 animate-pulse"
              viewBox="0 0 1024 1024"
              version="1.1"
            >
              <path
                d="M512 981.333333C252.8 981.333333 42.666667 771.2 42.666667 512S252.8 42.666667 512 42.666667s469.333333 210.133333 469.333333 469.333333-210.133333 469.333333-469.333333 469.333333z m-50.432-326.101333L310.613333 504.32a32 32 0 0 0-45.226666 45.226667l174.72 174.762666a32.341333 32.341333 0 0 0 0.341333 0.341334l0.256 0.213333a32 32 0 0 0 50.048-6.144l337.450667-379.605333a32 32 0 1 0-47.872-42.496l-318.762667 358.613333z"
                fill="#8A3FFC"
              />
            </svg>
            Submit Succesfull
          </>
        );
      }
      return 'Submit';
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen absolute inset-0">
      <AnimatedBlobs />
      <form className="grid text-center gap-5 z-0 absolute font-medium px-12 py-8 md:px-16 md:py-12 lg:px-20 lg:py-16 border-2 border-gray-500/50 rounded-2xl">
        <p className="mb-5 font-bold text-2xl text-center text-main-purple">
          Registration
        </p>
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
        <button
          onClick={handleSubmit(onSubmit)}
          className={`${
            error === null || isSubmitSuccessfull === null
              ? 'bg-main-purple text-porcelain p-3'
              : 'cursor-not-allowed'
          } max-w-fit justify-self-center rounded-full justify-center items-center flex flex-row`}
          disabled={error !== null || isSubmitSuccessfull === true}
        >
          {renderConditionalResults()}
        </button>
      </form>
    </div>
  );
};

export default RegisterUserForm;
