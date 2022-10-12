import React, { memo } from 'react';
import { FieldError } from 'react-hook-form';

export interface InputFormInterface {
  value: string;
  onChange: (...event: any[]) => void;
  error: FieldError | undefined;
  type: 'text' | 'password' | 'email';
  inputName: string;
  setRenderNavOnMobile?: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputForm = memo(
  ({
    value,
    onChange,
    error,
    type,
    inputName,
    setRenderNavOnMobile,
  }: InputFormInterface) => {
    const errorMessage = (error: FieldError) => {
      switch (error.type) {
        case 'required':
          return 'Field is required';
        case 'pattern':
          return 'Email is invalid';
      }
    };
    const onFocus = () => {
      if (setRenderNavOnMobile !== undefined) {
        setRenderNavOnMobile(false);
      }
    };
    const onBlur = () => {
      if (setRenderNavOnMobile !== undefined) {
        setRenderNavOnMobile(true);
      }
    };
    return (
      <label className="relative">
        <input
          className={`peer transition-all duration-500 p-3 rounded-md ring-offset-1 ring-gray-400/80
              ring-1 outline-offset-1 outline-3 autofill:bg-[#E8F0FE]] ${
                error
                  ? ' outline-red-600 ring-red-600'
                  : ' hover:ring-gray-600 focus:outline-main-purple/80'
              }`}
          type={type}
          name={inputName}
          onChange={onChange}
          value={value}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <span
          className={`transtion-all duration-500 absolute left-3 top-3
            ${
              error
                ? 'text-red-600 translate-x-[-12.5%] translate-y-[-100%] scale-[85%] px-1'
                : 'text-black/50 peer-focus:text-main-purple '
            }
            ${
              value !== undefined &&
              value.length !== 0 &&
              !error &&
              'scale-[85%] translate-x-[-12.5%] translate-y-[-100%]'
            }
            pointer-events-none
           peer-focus:scale-[85%] peer-focus:translate-x-[-12.5%] peer-focus:translate-y-[-100%]
            bg-white rounded-full peer-focus:px-1 peer-autofill:bg-[#E8F0FE]`}
        >
          {inputName.charAt(0).toUpperCase() + inputName.slice(1)}
        </span>
        {error && (
          <span
            className="transition-all duration-500 absolute text-red-600 scale-75
           -bottom-3 -right-2 bg-white rounded-md animate-appearing-error"
          >
            {errorMessage(error)}
          </span>
        )}
      </label>
    );
  },
);

export default InputForm;
