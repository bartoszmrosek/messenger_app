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

interface UserInformations {
  user_id?: number;
  username?: string;
}

const SearchResultsPage = () => {
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
  const { user, handleNewMessage }: UserContextExports =
    useContext(UserContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchParams] = useSearchParams();
  const [renderedUsers, setRenderedUsers] = useState<JSX.Element>(<></>);
  const navigate = useNavigate();
  const [error, setError] = useErrorType();

  const handleClick = (userInfo: UserInformations) => {
    if (handleNewMessage !== undefined && user !== null) {
      handleNewMessage({
        message_id: nanoid(),
        username: userInfo.username,
        message: null,
        sender_user_id: user?.user_id,
        reciever_user_id: userInfo.user_id,
        is_read: null,
        created_at: null,
      });
      navigate('/Messeges', { state: { activeChat: userInfo.user_id } });
    }
  };

  useEffect(() => {
    const username = searchParams.get('username');
    if (user && username && username.length > 0) {
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
            if (resError || dbResponse.type === 'error') {
              resError ? setError(resError) : setError(dbResponse.payload);
            } else {
              setError(null);
              if (
                Array.isArray(dbResponse.payload) &&
                dbResponse.payload.length > 0
              ) {
                const listOfMatchingUsers = dbResponse.payload.map(element => {
                  if (element.username !== user?.username) {
                    return (
                      <section
                        key={element.user_id}
                        className="last-of-type:mb-28 flex flex-row justify-between items-center w-full border px-3"
                      >
                        <span className="flex flex-row items-center justify-start gap-2">
                          <SvgIcons type="user" className="h-16 w-16" />
                          <h1 className="font-semibold capitalize">
                            {element.username}
                          </h1>
                        </span>
                        {user && (
                          <button
                            onClick={() => handleClick(element)}
                            className="rounded-3xl p-2 bg-main-purple text-porcelain"
                          >
                            Send message
                          </button>
                        )}
                      </section>
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
            }
          },
        );
    }
  }, [searchParams.get('username')]);
  useEffect(() => {
    setRenderedUsers(<div>{error}</div>);
  }, [error]);
  return renderedUsers;
};
export default SearchResultsPage;
