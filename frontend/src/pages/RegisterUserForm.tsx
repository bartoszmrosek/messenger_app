import React, { useEffect } from 'react';

import AnimatedBlobs from '../components/AnimatedBlobs';
import FormTemplate from '../components/FormsComponents/FormTemplate';
import { mainSubmit } from '../components/FormsComponents/FormTemplate';

const RegisterUserForm = ({
  setRenderNavOnMobile,
}: {
  setRenderNavOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const onSubmit: mainSubmit = (
    data,
    setLoading,
    setFormStateResetSwitch,
    setError,
    setSuccess,
  ) => {
    (async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3030/api/Register', {
          method: 'POST',
          headers: {
            'content-type': 'application/json;charset=UTF-8',
          },
          signal,
          body: JSON.stringify(data),
        });
        if (response.ok) {
          setSuccess('Registration succeded');
        } else {
          setError(response.status);
        }
      } catch (error) {
        setSuccess(null);
        setError(error);
      } finally {
        setLoading(false);
        setFormStateResetSwitch(prev => !prev);
      }
    })();
  };

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, []);

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
              pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
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
