import React, { FunctionComponent, createContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
interface UserContextChildren {
  children?: React.ReactNode;
}

interface userPropertiesInterface {
  (user_id: number, username: string, email: string, password?: string): void;
}

export interface userMessageInterface {
  message_id: number;
  username: string;
  message: string;
  sender_user_id: number;
  reciever_user_id: number;
  isRead: boolean;
  created_at: string;
}

interface userInformationsInterface {
  user_id: number;
  username: string;
  email: string;
}

export interface UserContextExports {
  user?: userInformationsInterface;
  removeUser?: () => void;
  loginUser?: userPropertiesInterface;
  userMessages?: userMessageInterface[];
  getAndSetMessagesFromHistory?: (newMessage: userMessageInterface[]) => void;
  handleNewMessage?: (messages: unknown) => void;
}

const UserContext = createContext({});

const UserContextProvider: FunctionComponent<UserContextChildren> = ({
  children,
}) => {
  const [userMessages, setUserMessages] = useState<userMessageInterface[]>([]);
  const [user, setUser, removeUser] = useLocalStorage('user', null);

  const loginUser: userPropertiesInterface = (user_id, username, email) => {
    setUser({ user_id, username, email });
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
        user,
        removeUser,
        loginUser,
        userMessages,
        getAndSetMessagesFromHistory,
        handleNewMessage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export { UserContextProvider, UserContext };
