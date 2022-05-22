import React, { FunctionComponent, createContext, useState } from 'react';

interface UserContextChildren {
  children?: React.ReactNode;
}

interface userTypes{
  (user_id: string, username: string, email: string, password: string): void
}

const UserContext = createContext({});
const UserContextProvider: FunctionComponent<UserContextChildren> = ({
  children,
}) => {
  const [userInformations, setUserInformations] = useState({});
  const handleNewInformations:userTypes = (
    user_id,
    username,
    email
  ) => {
    setUserInformations({ user_id, username, email});
  }
  return (
    <UserContext.Provider value={{ userInformations, handleNewInformations }}>
      {children}
    </UserContext.Provider>
  );
};
export { UserContextProvider, UserContext};
