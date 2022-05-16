import { useForm, SubmitHandler } from 'react-hook-form';
import { useContext } from 'react';

interface userInput {
  username: String;
  email: String;
  password: String;
}

const RegisterUserForm = ({socket}: any) => {
  const { register, handleSubmit } = useForm<userInput>();
  const onSubmit: SubmitHandler<userInput> = (data) => {};

  return (
    <div>
      <form>
        <label>Username</label>
        <input
          type="text"
          {...register('username', {
            required: 'username is required',
            minLength: 1
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
    </div>
  );
};

export default RegisterUserForm;
