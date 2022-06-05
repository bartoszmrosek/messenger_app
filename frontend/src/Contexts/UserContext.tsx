import React, {
  FunctionComponent,
  createContext,
  useState,
  useContext,
} from 'react';
import { SocketContext } from './SocketContext';
interface UserContextChildren {
  children?: React.ReactNode;
}

interface userTypes {
  (user_id: number, username: string, email: string, password?: string): void;
}

interface userMessagesTypes {
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
  handleNewMessage?: (messages: any[]) => void;
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
  const handleNewMessage = (messages: any) => {
    setUserMessages(messages);
  };
  return (
    <UserContext.Provider
      value={{
        userInformations,
        handleNewInformations,
        userMessages,
        handleNewMessage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export { UserContextProvider, UserContext };
export type { userMessagesTypes, exportUserContextTypes };
