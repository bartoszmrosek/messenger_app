import { useForm, SubmitHandler } from 'react-hook-form';
import { useContext, useState } from 'react';
import { SocketContext } from '../SocketContext';

interface userInput {
  username: String;
  email: String;
  password: String;
}

const RegisterUserForm = () => {
  const socket: any = useContext(SocketContext);
  const { register, handleSubmit } = useForm<userInput>();
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState(false);
  const onSubmit: SubmitHandler<userInput> = data => {
    socket.emit('checkOrCreateUser', { data }, (createdUser: boolean) => {
      if (createdUser) {
        setIsSubmitSuccessfull(true);
      }
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
        {isSubmitSuccessfull
          ? 'Uzytkownik zostal utworzony'
          : 'Uzytkownik juz istnieje'}
      </p>
    </div>
  );
};

export default RegisterUserForm;
