import { useForm, SubmitHandler } from 'react-hook-form';
import React, { useContext, useState } from 'react';
import { SocketContext } from '../Contexts/SocketContext';
import { standardDbResponse } from '../interfaces/dbResponsesInterface';
import ErrorOverlay from '../components/ErrorOverlay';
import useErrorType from '../hooks/useErrorType';

interface userInput {
  username: String;
  email: String;
  password: String;
}

const RegisterUserForm = () => {
  const { standardSocket }: any = useContext(SocketContext);
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
    <div>
      <form>
        <label>Username</label>
        <input
          type="text"
          {...register('username', {
            required: 'username is required',
            minLength: 1,
          })}
          name="username"
          placeholder="username"
        />
        <label>Email</label>
        <input
          type="email"
          {...register('email', { required: 'email is required' })}
          name="email"
          placeholder="email"
        />
        <label>Email</label>
        <input
          type="password"
          {...register('password', { required: 'password is required' })}
          name="password"
          placeholder="password"
        />
        <button onClick={handleSubmit(onSubmit)}>Submit</button>
      </form>
      {isSubmitSuccessfull && <p>Submit succesfull</p>}
      {error !== null && <ErrorOverlay error={error} />}
    </div>
  );
};

export default RegisterUserForm;
