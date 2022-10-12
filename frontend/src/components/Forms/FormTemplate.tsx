import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import InputForm from './InputForm';
import useErrorType from '../../hooks/useErrorType';
import SvgIcons from '../../components/SvgIcons';

export interface userInput {
  username: string;
  email: string;
  password: string;
}

export type mainSubmit = (
  data: userInput,
  setLoading: React.Dispatch<React.SetStateAction<boolean | null>>,
  setFormStateResetSwitch: React.Dispatch<React.SetStateAction<boolean>>,
  setError: (error: unknown) => void,
  setSuccess: React.Dispatch<React.SetStateAction<boolean | null>>,
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
  setRenderNavOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormTemplate = ({
  title,
  renderedInputs,
  mainSubmitHandler,
  setRenderNavOnMobile,
}: FormTemplateProps) => {
  const { handleSubmit, control } = useForm<userInput>();
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState<
    boolean | null
  >(null);
  const [error, setError] = useErrorType();
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [formStateResetSwitch, setFormStateResetSwitch] = useState(false);

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
                    setRenderNavOnMobile={setRenderNavOnMobile}
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
          mainSubmitHandler(
            data,
            setIsLoading,
            setFormStateResetSwitch,
            setError,
            setIsSubmitSuccessfull,
          );
        })}
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
  );
};

export default FormTemplate;
