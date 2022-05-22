import React, {useContext, useState} from 'react'
import { SocketContext } from '../Contexts/SocketContext';
import { UserContext } from '../Contexts/UserContext';
import { useForm, SubmitHandler } from 'react-hook-form';
import dbResponseHandler from '../DatabaseHandlers/dbResponse'

interface userInput {
    email: string,
    password: string
}
interface dbResponse{
    type: string,
    payload?: {
        user_id: string,
        username: string,
        email:string,
        password:string
    }
}

const LoginForm = () =>{
    const socket: any = useContext(SocketContext);
    const userSetter: any = useContext(UserContext);
    const [errorType, setErrorType] = useState('')
    const { register, handleSubmit } = useForm<userInput>();

    const onSubmit: SubmitHandler<userInput> = data => {
        socket.emit('checkUserLoginData', { data }, (dbResponse: dbResponse) => {
            if(dbResponse.type === 'confirm'){
                const { payload } = dbResponse;
                userSetter.handleNewInformations(
                    payload?.user_id,
                    payload?.username,
                    payload?.email
                )
            }else{
                dbResponseHandler(dbResponse.type, setErrorType)
            }
        });
    };
    console.log(errorType)

    return(
        <form>
        <label>Email</label>
        <input
          type="email"
          {...register('email', { required: 'email is required' })}
          name="email"
          placeholder="email"
        />
        <label>Password:</label>
        <input
          type="password"
          {...register('password', { required: 'password is required' })}
          name="password"
          placeholder="password"
        />
        <button onClick={handleSubmit(onSubmit)}>Submit</button>
        </form>
    )
}
export default LoginForm;