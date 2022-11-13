import React, { FunctionComponent, createContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { UserMessageInterface } from '../interfaces/MessageInterfaces';
interface UserContextChildren {
  children?: React.ReactNode;
}

interface userPropertiesInterface {
  (user_id: number, username: string, email: string, password?: string): void;
}

export interface userInformationsInterface {
  user_id: number;
  username: string;
  email: string;
}

export interface UserContextExports {
  loggedUser: userInformationsInterface;
  loginUser: userPropertiesInterface;
  userConnetions: UserMessageInterface[];
  setUserConnections: React.Dispatch<
    React.SetStateAction<UserMessageInterface[]>
  >;
  logoutUser: () => void;
}

const UserContext = createContext<UserContextExports>(null);

const UserContextProvider: FunctionComponent<UserContextChildren> = ({
  children,
}) => {
  const [userConnetions, setUserConnections] = useState<UserMessageInterface[]>(
    [],
  );
  const [loggedUser, setLoggedUser, removeLoggedUser] = useLocalStorage(
    'user',
    null,
  );

  const logoutUser = () => {
    removeLoggedUser();
    setUserConnections([]);
  };

  const loginUser: userPropertiesInterface = (user_id, username, email) => {
    setLoggedUser({ user_id, username, email });
  };

  return (
    <UserContext.Provider
      value={{
        loggedUser,
        userConnetions,
        setUserConnections,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export { UserContextProvider, UserContext };
