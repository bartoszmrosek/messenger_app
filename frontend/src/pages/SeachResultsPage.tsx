import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SocketContext } from '../Contexts/SocketContext';
import { UserContext } from '../Contexts/UserContext';

const SearchResultsPage = () => {
  const { standardSocket }: any = useContext(SocketContext);
  const { userInformations }: any = useContext(UserContext);
  const { state }: any = useLocation();
  const [renderedResults, setRenderedResults] = useState<
    [] | React.ReactNode
  >();

  const handleClick = (user_id: number | undefined) => {
    if (user_id !== undefined) {
    }
  };

  useEffect(() => {
    standardSocket.emit(
      'searchUser',
      state.searchParameters,
      (dbResponse: { user_id?: number; username?: string }[]) => {
        if (dbResponse.length > 0) {
          const listOfMatchingUsers = dbResponse.map(element => {
            return (
              <section key={element.user_id}>
                <h1>{element.username}</h1>
                {userInformations.user_id !== undefined && (
                  <button onClick={() => handleClick(element.user_id)}>
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
