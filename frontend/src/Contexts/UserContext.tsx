import React, { FunctionComponent, createContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
interface UserContextChildren {
  children?: React.ReactNode;
}

interface userPropertiesInterface {
  (user_id: number, username: string, email: string, password?: string): void;
}

export interface userMessageInterface {
  user_id?: number;
  message_id: number | string;
  username: string;
  message: string | null;
  sender_user_id: number;
  reciever_user_id: number;
  isRead: boolean | null;
  created_at: string | null;
}

export interface userInformationsInterface {
  user_id: number;
  username: string;
  email: string;
}

export interface UserContextExports {
  loggedUser: userInformationsInterface;
  loginUser: userPropertiesInterface;
  userConnetions: userMessageInterface[];
  setUserConnections: React.Dispatch<
    React.SetStateAction<userMessageInterface[]>
  >;
  logoutUser: () => void;
}

const UserContext = createContext<UserContextExports>(null);

const UserContextProvider: FunctionComponent<UserContextChildren> = ({
  children,
}) => {
  const [userConnetions, setUserConnections] = useState<userMessageInterface[]>(
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
