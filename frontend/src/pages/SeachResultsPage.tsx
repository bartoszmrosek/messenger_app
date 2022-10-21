import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { nanoid } from 'nanoid';

import { SocketContext } from '../Contexts/SocketContext';
import { UserContext } from '../Contexts/UserContext';
import useErrorType from '../hooks/useErrorType';

import { UserContextExports } from '../Contexts/UserContext';
import { standardDbResponse } from '../interfaces/dbResponsesInterface';
import { Socket } from 'socket.io-client';
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../interfaces/socketContextInterfaces';
import SvgIcons from '../components/SvgIcons';
import FoundUserSection from '../components/SearchComponents/FoundUserSection';
import ErrorDisplayer from '../components/ErrorDisplayer';

interface UserInformations {
  user_id?: number;
  username?: string;
}

const SearchResultsPage = () => {
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
  const { loggedUser, handleNewMessage }: UserContextExports =
    useContext(UserContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useErrorType();
  const [renderedUsers, setRenderedUsers] = useState<JSX.Element>(<></>);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [retrySwitch, setRetrySwitch] = useState<boolean>(false);

  const makeNewMessage = (userId: number, username: string) => {
    if (handleNewMessage !== undefined && loggedUser !== null) {
      handleNewMessage({
        message_id: nanoid(),
        username: username,
        message: null,
        sender_user_id: loggedUser?.user_id,
        reciever_user_id: userId,
        is_read: null,
        created_at: null,
      });
      navigate('/Messeges', { state: { activeChat: userId } });
    }
  };

  useEffect(() => {
    const username = searchParams.get('username');
    if (loggedUser && username && username.length > 0) {
      setIsLoading(true);
      standardSocket
        .timeout(10000)
        .emit(
          'searchUser',
          username,
          (
            resError: unknown,
            dbResponse: standardDbResponse<
              [{ user_id: number; username: string }] | number
            >,
          ) => {
            try {
              if (resError || dbResponse.type === 'error') {
                throw resError
                  ? setError(resError)
                  : setError(dbResponse.payload);
              }
              setError(null);
              if (
                Array.isArray(dbResponse.payload) &&
                dbResponse.payload.length > 0
              ) {
                const listOfMatchingUsers = dbResponse.payload.map(element => {
                  if (element.username !== loggedUser?.username) {
                    return (
                      <FoundUserSection
                        key={element.user_id}
                        userId={element.user_id}
                        username={element.username}
                        handleClick={makeNewMessage}
                      />
                    );
                  }
                });
                setRenderedUsers(
                  <div className="mx-8 mt-12 flex flex-col gap-5 items-center">
                    <h1 className="font-bold text-2xl text-main-purple">
                      Matched users:
                    </h1>
                    {listOfMatchingUsers}
                  </div>,
                );
              } else {
                setRenderedUsers(<div>'No matches'</div>);
              }
            } catch (error) {
              setError(error);
            } finally {
              setIsLoading(false);
            }
          },
        );
    }
  }, [searchParams.get('username'), retrySwitch]);
  return (
    <>
      {!isLoading && error && (
        <ErrorDisplayer error={error} retrySwitch={setRetrySwitch} />
      )}
      {isLoading && <div>Loading</div>}
      {!error && !isLoading && renderedUsers}
    </>
  );
};
export default SearchResultsPage;
