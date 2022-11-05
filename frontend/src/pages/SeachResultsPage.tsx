import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { nanoid } from 'nanoid';

import { UserContext, userMessageInterface } from '../Contexts/UserContext';
import useErrorType from '../hooks/useErrorType';

import { UserContextExports } from '../Contexts/UserContext';
import FoundUserSection from '../components/SearchComponents/FoundUserSection';
import ErrorDisplayer from '../components/ErrorDisplayer';
import Loader from '../components/Loader';

const SearchResultsPage = () => {
  const { loggedUser, userConnetions, setUserConnections } = useContext(
    UserContext,
  ) as UserContextExports;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useErrorType();
  const [renderedUsers, setRenderedUsers] = useState<JSX.Element>(<></>);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retrySwitch, setRetrySwitch] = useState<boolean>(false);

  const makeNewMessage = (userId: number, username: string) => {
    if (loggedUser) {
      const nullMessage: userMessageInterface = {
        message_id: nanoid(),
        username: username,
        message: null,
        sender_user_id: loggedUser.user_id,
        reciever_user_id: userId,
        is_read: null,
        created_at: null,
      };

      if (
        !userConnetions.some(message => {
          return (
            message.message === null &&
            message.reciever_user_id === nullMessage.reciever_user_id
          );
        })
      ) {
        setUserConnections(prev => [nullMessage, ...prev]);
      }
      navigate('/Messages', {
        state: { from: '/SearchResultsPage', activeChat: userId },
      });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const username = searchParams.get('username');
    if (loggedUser && username && username.length > 0) {
      setIsLoading(true);
      (async () => {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_REST_ENDPOINT
            }/api/Search?username=${username}`,
            {
              signal,
              credentials: 'include',
            },
          );
          if (!response.ok) throw response.status;
          setError(null);
          const result: [{ user_id: number; username: string }] =
            await response.json();
          if (result.length > 0) {
            const withoutLoggedUser = result.map(user => {
              return user.username !== loggedUser.username ? (
                <FoundUserSection
                  key={user.user_id}
                  userId={user.user_id}
                  username={user.username}
                  handleClick={makeNewMessage}
                />
              ) : null;
            });
            setRenderedUsers(
              <div className="mx-8 flex flex-col gap-5 items-center h-full w-full">
                <h1 className="font-bold mt-12 lg:mt-28 text-2xl text-main-purple">
                  Matched users:
                </h1>
                {withoutLoggedUser}
              </div>,
            );
          } else {
            setRenderedUsers(
              <div className="h-full w-full flex justify-center items-center lg:items-start text-xl font-semibold text-main-purple">
                <p>No matches</p>
              </div>,
            );
          }
          setIsLoading(false);
        } catch (error) {
          if (!signal.aborted) {
            setError(error);
            setIsLoading(false);
          }
        }
      })();
    }
    return () => {
      controller.abort('abort on unmount');
    };
  }, [searchParams.get('username'), retrySwitch]);
  return (
    <>
      {isLoading && <Loader loadingMessage="Searching..." />}
      {!isLoading && error && (
        <ErrorDisplayer error={error} retrySwitch={setRetrySwitch} />
      )}
      {!error && !isLoading && renderedUsers}
    </>
  );
};
export default SearchResultsPage;
