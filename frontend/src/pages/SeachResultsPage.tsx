import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { SocketContext } from '../Contexts/SocketContext';
import { UserContext } from '../Contexts/UserContext';
import type { exportUserContextTypes } from '../Contexts/UserContext';

interface foundUserInformations {
  user_id?: number;
  username?: string;
}

const SearchResultsPage = () => {
  const { standardSocket }: any = useContext(SocketContext);
  const { userInformations, handleNewMessage }: exportUserContextTypes =
    useContext(UserContext);
  const { state }: any = useLocation();
  const [renderedResults, setRenderedResults] = useState<
    [] | React.ReactNode
  >();
  const navigate = useNavigate();

  const handleClick = (userInfo: foundUserInformations) => {
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
    standardSocket.emit(
      'searchUser',
      state.searchParameters,
      (dbResponse: foundUserInformations[]) => {
        if (dbResponse.length > 0 && userInformations !== undefined) {
          const listOfMatchingUsers = dbResponse.map(element => {
            return (
              <section key={element.user_id}>
                <h1>{element.username}</h1>
                {userInformations.user_id !== undefined && (
                  <button onClick={() => handleClick(element)}>
                    Send message
                  </button>
                )}
              </section>
            );
          });
          setRenderedResults(listOfMatchingUsers);
        } else {
          setRenderedResults(<div>Brak wyszukań</div>);
        }
      },
    );
  }, [state.searchParameters]);
  return <div>{renderedResults}</div>;
};
export default SearchResultsPage;
