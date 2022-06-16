import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { SocketContext } from '../Contexts/SocketContext';
import { UserContext } from '../Contexts/UserContext';
import useErrorType from '../hooks/useErrorType';
import type { exportUserContextTypes } from '../Contexts/UserContext';
import type { standardDbResponse } from '../interfaces/dbResponsesInterface';

interface UserInformations {
  user_id?: number;
  username?: string;
}

const SearchResultsPage = () => {
  const { standardSocket }: any = useContext(SocketContext);
  const { userInformations, handleNewMessage }: exportUserContextTypes =
    useContext(UserContext);
  const { state }: any = useLocation();
  const [renderedResults, setRenderedResults] = useState<
    string | React.ReactNode
  >();
  const navigate = useNavigate();
  const [error, setError] = useErrorType();

  const handleClick = (userInfo: UserInformations) => {
    if (handleNewMessage !== undefined) {
      handleNewMessage({
        message_id: nanoid(),
        username: userInfo.username,
        message: null,
        sender_user_id: userInformations?.user_id,
        reciever_user_id: userInfo.user_id,
        is_read: null,
        created_at: null,
      });
      navigate('/Messeges', { state: { activeChat: userInfo.user_id } });
    }
  };

  useEffect(() => {
    standardSocket
      .timeout(10000)
      .emit(
        'searchUser',
        state.searchParameters,
        (
          resError: unknown,
          dbResponse: standardDbResponse<
            [{ user_id: number; username: string }] | number
          >,
        ) => {
          if (resError || dbResponse.type === 'error') {
            resError ? setError(resError) : setError(dbResponse.payload);
          } else {
            setError(null);
            if (
              typeof dbResponse.payload === 'object' &&
              dbResponse.payload.length > 0
            ) {
              const listOfMatchingUsers = dbResponse.payload.map(element => {
                return (
                  <section key={element.user_id}>
                    <h1>{element.username}</h1>
                    {userInformations !== undefined && (
                      <button onClick={() => handleClick(element)}>
                        Send message
                      </button>
                    )}
                  </section>
                );
              });
              setRenderedResults(listOfMatchingUsers);
            } else {
              setRenderedResults('Brak wyszukań');
            }
          }
        },
      );
  }, [state.id]);
  useEffect(() => {
    setRenderedResults(error);
  }, [error]);
  return <div>{renderedResults}</div>;
};
export default SearchResultsPage;
