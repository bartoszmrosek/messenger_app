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
  loggedUser?: userInformationsInterface;
  loginUser?: userPropertiesInterface;
  userMessages?: userMessageInterface[];
  getAndSetMessagesFromHistory?: (newMessage: userMessageInterface[]) => void;
  handleNewMessage?: (messages: userMessageInterface) => void;
  logoutUser: () => void;
}

const UserContext = createContext<UserContextExports | null>(null);

const UserContextProvider: FunctionComponent<UserContextChildren> = ({
  children,
}) => {
  const [userMessages, setUserMessages] = useState<userMessageInterface[]>([]);
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

  const getAndSetMessagesFromHistory = (messages: userMessageInterface[]) => {
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
        getAndSetMessagesFromHistory,
        handleNewMessage,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export { UserContextProvider, UserContext };
