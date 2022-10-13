import React, { useContext } from 'react';
import { SocketContext } from '../Contexts/SocketContext';
import { UserContext } from '../Contexts/UserContext';
import type { exportUserContextTypes } from '../Contexts/UserContext';
import type { standardDbResponse } from '../interfaces/dbResponsesInterface';
import type { Socket } from 'socket.io-client';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../interfaces/socketContextInterfaces';
import AnimatedBlobs from '../components/AnimatedBlobs';
import FormTemplate, { mainSubmit } from '../components/Forms/FormTemplate';

const LoginForm = ({
  setRenderNavOnMobile,
}: {
  setRenderNavOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
  const userSetter: exportUserContextTypes = useContext(UserContext);

  const onSubmit: mainSubmit = (
    data,
    setLoading,
    setFormStateResetSwitch,
    setError,
    setSuccess,
  ) => {
    standardSocket.timeout(10000).emit(
      'checkUserLoginData',
      { data },
      (
        error: unknown,
        dbResponse: standardDbResponse<{
          user_id: number;
          username: string;
          email: string;
        }>,
      ) => {
        setLoading(true);
        setFormStateResetSwitch(prev => !prev);
        if (error) {
          setLoading(false);
          setError(error);
        } else {
          setLoading(false);
          if (dbResponse.type === 'confirm') {
            setError(null);
            setSuccess(true);
            const { payload } = dbResponse;
            if (userSetter.handleNewInformations !== undefined) {
              userSetter.handleNewInformations(
                payload.user_id,
                payload.username,
                payload.email,
              );
            }
          } else {
            setSuccess(false);
            setError(dbResponse.payload);
          }
        }
      },
    );
  };
  return (
    <div className="flex items-center justify-center h-screen w-screen absolute inset-0">
      <AnimatedBlobs />
      <FormTemplate
        title="Login"
        setRenderNavOnMobile={setRenderNavOnMobile}
        mainSubmitHandler={onSubmit}
        renderedInputs={[
          {
            name: 'email',
            type: 'email',
            rules: {
              required: true,
            },
          },
          {
            name: 'password',
            type: 'password',
            rules: {
              required: true,
            },
          },
        ]}
      />
    </div>
  );
};
export default LoginForm;
