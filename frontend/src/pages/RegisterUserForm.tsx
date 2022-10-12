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
import SvgIcons from '../components/SvgIcons';

interface userInput {
  username: string;
  email: string;
  password: string;
}

const RegisterUserForm = ({
  setRenderNavOnMobile,
}: {
  setRenderNavOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
    const resetingFunction = setTimeout(
      () => {
        setError(null);
        setIsSubmitSuccessfull(null);
        setIsLoading(null);
      },
      error ? 7500 : 5000,
    );
    return () => {
      clearTimeout(resetingFunction);
    };
  }, [formStateResetSwitch]);

  const renderResults = () => {
    if (isLoading) {
      return (
        <>
          <SvgIcons type="loading" />
          Processing...
        </>
      );
    } else {
      if (error) {
        return (
          <>
            <SvgIcons type="error" />
            <span className="text-red-600">{error}</span>
            <SvgIcons type="error" />
          </>
        );
      }
      if (isSubmitSuccessfull) {
        return (
          <>
            <SvgIcons type="success" />
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
      <form className="grid text-center gap-5 z-0 absolute font-medium px-3 py-6 md:px-16 md:py-12 lg:px-20 lg:py-16 border-2 border-gray-500/50 rounded-2xl">
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
                setRenderNavOnMobile={setRenderNavOnMobile}
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
                setRenderNavOnMobile={setRenderNavOnMobile}
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
                setRenderNavOnMobile={setRenderNavOnMobile}
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
          {renderResults()}
        </button>
      </form>
    </div>
  );
};

export default RegisterUserForm;
