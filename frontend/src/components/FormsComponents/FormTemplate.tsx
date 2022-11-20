import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import InputForm from './InputForm';
import useErrorType from '../../hooks/useErrorType';
import SvgIcons from '../SvgIcons';
import { useLocation } from 'react-router-dom';
import useRequestStatus from '../../hooks/useRequestStatus';

export interface userInput {
  username: string;
  email: string;
  password?: string;
}

export type mainSubmit = (
  data: userInput,
  setLoading: React.Dispatch<React.SetStateAction<boolean | null>>,
  setFormStateResetSwitch: React.Dispatch<React.SetStateAction<boolean>>,
  setError: (error: unknown) => void,
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>,
) => void;

export interface FormTemplateProps {
  title: string;
  renderedInputs: {
    name: keyof userInput;
    type: 'text' | 'email' | 'password';
    rules: {
      required?: boolean;
      minLength?: number;
      pattern?: RegExp;
    };
  }[];
  mainSubmitHandler: mainSubmit;
}

const FormTemplate = ({
  title,
  renderedInputs,
  mainSubmitHandler,
}: FormTemplateProps) => {
  const { handleSubmit, control } = useForm<userInput>();
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState<string | null>(
    null,
  );
  const [error, setError] = useErrorType();
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [formStateResetSwitch, setFormStateResetSwitch] = useState(false);
  const [longWaitingInfo, startWaitingInfoTimer] = useRequestStatus();
  // Same situation as in SearchResultsPage, only any works in react-router type assertion
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state }: any = useLocation();

  useEffect(() => {
    const resetingFunction = setTimeout(
      () => {
        setError(null);
        setIsSubmitSuccessfull(null);
        setIsLoading(null);
      },
      error ? 5000 : 2500,
    );
    return () => {
      clearTimeout(resetingFunction);
    };
  }, [formStateResetSwitch]);

  const renderResults = () => {
    if (isLoading) {
      return (
        <>
          <SvgIcons
            type="loading"
            className="animate-spin mr-3 h-5 w-5 text-white"
          />
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
            {isSubmitSuccessfull}
          </>
        );
      }
      return 'Submit';
    }
  };

  return (
    <form className="grid text-center gap-5 z-0 absolute font-medium px-3 py-6 md:px-16 md:py-12 lg:px-20 lg:py-16 border-2 border-gray-500/50 rounded-2xl">
      <p className="mb-5 font-bold text-2xl text-center text-main-purple">
        {title}
      </p>
      {renderedInputs.map(input => {
        return (
          <Controller
            key={input.name}
            name={input.name}
            control={control}
            rules={{
              required: input.rules.required,
              minLength: input.rules.minLength || 1,
              pattern: input.rules.pattern,
            }}
            defaultValue=""
            render={({ field, fieldState }) => {
              if (field.value !== undefined) {
                return (
                  <InputForm
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error}
                    type={input.type}
                    inputName={input.name}
                  />
                );
              }
              return <></>;
            }}
          />
        );
      })}
      <button
        onClick={handleSubmit(data => {
          startWaitingInfoTimer(prev => prev++);
          mainSubmitHandler(
            data,
            setIsLoading,
            setFormStateResetSwitch,
            setError,
            setIsSubmitSuccessfull,
          );
        })}
        className={`${
          //prettier-ignore
          (error === null || isSubmitSuccessfull !== null )
            ? 'bg-main-purple text-porcelain'
            : 'bg-porcelain cursor-not-allowed border-2 border-red-600'
        } p-3 max-w-fit justify-self-center rounded-full justify-center items-center flex flex-row`}
        disabled={error !== null || typeof isSubmitSuccessfull === 'string'}
      >
        {renderResults()}
      </button>
      {longWaitingInfo && <p>{longWaitingInfo}</p>}
      {state && state.status && <p>{state.status}</p>}
    </form>
  );
};

export default FormTemplate;
