import React, { useContext } from 'react';
import { UserContext } from '../Contexts/UserContext';
import { UserContextExports } from '../Contexts/UserContext';
import AnimatedBlobs from '../components/AnimatedBlobs';
import FormTemplate, {
  mainSubmit,
} from '../components/FormsComponents/FormTemplate';
import { userInformationsInterface } from '../Contexts/UserContext';

const LoginForm = ({
  setRenderNavOnMobile,
}: {
  setRenderNavOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { loginUser } = useContext(UserContext) as UserContextExports;

  const onSubmit: mainSubmit = async (
    data,
    setLoading,
    setFormStateResetSwitch,
    setError,
    setSuccess,
  ) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3030/api/Login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (response.ok) {
        const data: userInformationsInterface = await response.json();
        const { user_id, username, email } = data;
        if (user_id && username && email) {
          loginUser(user_id, username, email);
          setSuccess('Login succeded!');
        }
      } else {
        throw 401;
      }
    } catch (error) {
      setError(error);
    } finally {
      setFormStateResetSwitch(prev => !prev);
      setLoading(false);
    }
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
              pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
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
