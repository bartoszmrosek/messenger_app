import { useForm, SubmitHandler } from 'react-hook-form';
import React, { useContext, useState } from 'react';
import { SocketContext } from '../Contexts/SocketContext';
import dbResponseHandler from '../DatabaseHandlers/dbResponse';

interface userInput {
  username: String;
  email: String;
  password: String;
}

const RegisterUserForm = () => {
  const { standardSocket }: any = useContext(SocketContext);
  const { register, handleSubmit } = useForm<userInput>();
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState('');

  const onSubmit: SubmitHandler<userInput> = data => {
    standardSocket.emit('checkOrCreateUser', { data }, (dbResponse: string) => {
      dbResponseHandler(dbResponse, setIsSubmitSuccessfull);
    });
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
      <p>
        {isSubmitSuccessfull === 'true'
          ? 'Użytkownik zostaly utworzony'
          : isSubmitSuccessfull === 'usrAlrInDbError'
          ? 'Dane użytkownika są obecnie używane'
          : 'Błąd połączenia z serwerem, spróbuj ponownie'}
      </p>
    </div>
  );
};

export default RegisterUserForm;
