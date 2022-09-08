import React, {
  FunctionComponent,
  createContext,
  useState,
} from 'react';
interface UserContextChildren {
  children?: React.ReactNode;
}

interface userTypes {
  (user_id: number, username: string, email: string, password?: string): void;
}

interface userMessagesTypes {
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

interface exportUserContextTypes {
  userInformations?: userInformationsInterface;
  handleNewInformations?: userTypes;
  userMessages?: userMessagesTypes[];
  getAndSetMessagesFromHistory?: (newMessage: any) => void;
  handleNewMessage?: (messages: unknown) => void;
}

const UserContext = createContext({});

const UserContextProvider: FunctionComponent<UserContextChildren> = ({
  children,
}) => {
  const [userInformations, setUserInformations] =
    useState<userInformationsInterface>();
  const [userMessages, setUserMessages] = useState<userMessagesTypes[]>([]);

  const handleNewInformations: userTypes = (user_id, username, email) => {
    setUserInformations({ user_id, username, email });
  };

  const getAndSetMessagesFromHistory = (messages: any) => {
    const nullMessagesToNewUsers = userMessages.filter(message => {
      return message.message === null;
    });
    setUserMessages([...messages, ...nullMessagesToNewUsers]);
  };

  const handleNewMessage = (newMessage: any) => {
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
        userInformations,
        handleNewInformations,
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
export type { userMessagesTypes, exportUserContextTypes };
