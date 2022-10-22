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
  userMessages: userMessageInterface[];
  setMessagesFromHistory: (newMessage: userMessageInterface[]) => void;
  handleNewMessage: (messages: userMessageInterface) => void;
  logoutUser: () => void;
  connectingUserState: {
    isConnectingUser: boolean;
    setIsConnectingUser: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const UserContext = createContext<UserContextExports>(null);

const UserContextProvider: FunctionComponent<UserContextChildren> = ({
  children,
}) => {
  const [userMessages, setUserMessages] = useState<userMessageInterface[]>([]);
  const [isConnectingUser, setIsConnectingUser] = useState<boolean | null>(
    null,
  );
  const [loggedUser, setLoggedUser, removeLoggedUser] = useLocalStorage(
    'user',
    null,
  );

  const logoutUser = () => {
    removeLoggedUser();
    setUserMessages([]);
  };

  const loginUser: userPropertiesInterface = (user_id, username, email) => {
    setLoggedUser({ user_id, username, email });
  };

  const setMessagesFromHistory = (messages: userMessageInterface[]) => {
    const nullMessagesToNewUsers = userMessages.filter(message => {
      return message.message === null;
    });
    setUserMessages([...messages, ...nullMessagesToNewUsers]);
  };

  const handleNewMessage = (newMessage: userMessageInterface) => {
    if (
      !(
        newMessage.message === null &&
        userMessages.some(message => message.username === newMessage.username)
      )
    ) {
      setUserMessages(prevList => [...prevList, newMessage]);
    }
  };

  return (
    <UserContext.Provider
      value={{
        loggedUser,
        userMessages,
        setMessagesFromHistory,
        handleNewMessage,
        loginUser,
        logoutUser,
        connectingUserState: {
          isConnectingUser,
          setIsConnectingUser,
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export { UserContextProvider, UserContext };
