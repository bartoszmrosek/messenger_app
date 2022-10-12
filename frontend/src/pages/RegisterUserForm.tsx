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
import AnimatedBlobs from '../components/AnimatedBlobs';
import FormTemplate from '../components/Forms/FormTemplate';
import { mainSubmit } from '../components/Forms/FormTemplate';

const RegisterUserForm = ({
  setRenderNavOnMobile,
}: {
  setRenderNavOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);

  const onSubmit: mainSubmit = (
    data,
    setLoading,
    setFormStateResetSwitch,
    setError,
    setSuccess,
  ) => {
    setLoading(true);
    standardSocket
      .timeout(10000)
      .emit(
        'checkOrCreateUser',
        { data },
        (error: unknown, dbResponse: standardDbResponse<null | number>) => {
          setLoading(false);
          setFormStateResetSwitch(prev => !prev);
          if (error) {
            setError(error);
          } else {
            if (dbResponse.type === 'confirm') {
              setError(null);
              setSuccess(true);
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
        title="Registration"
        renderedInputs={[
          {
            name: 'username',
            type: 'text',
            rules: {
              required: true,
              minLength: 1,
            },
          },
          {
            name: 'email',
            type: 'email',
            rules: {
              required: true,
              minLength: 1,
              pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
            },
          },
          {
            name: 'password',
            type: 'password',
            rules: {
              required: true,
              minLength: 1,
            },
          },
        ]}
        mainSubmitHandler={onSubmit}
        setRenderNavOnMobile={setRenderNavOnMobile}
      />
    </div>
  );
};

export default RegisterUserForm;
