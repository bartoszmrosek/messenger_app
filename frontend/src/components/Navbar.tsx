import { NavLink, useSearchParams } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { UserContext } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const {userInformations}: any = useContext(UserContext);
  const [searchParameters, setSearchParameters] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (
    inputValue: React.FormEvent<HTMLInputElement>,
  ): void => {
    setSearchParameters(inputValue.currentTarget.value);
  };

  const handleSearchSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    navigate('/SearchResults', { state: { searchParameters } });
  };

  const shouldRenderUser = () => {
    if (userInformations !== undefined) {
      return (
        <section>
          <h1>Username: {userInformations.username}</h1>
          <h3>Email: {userInformations.email}</h3>
        </section>
      );
    }
  };

  const shouldRenderNewListItems = () => {
    if (userInformations !== undefined) {
      return (
        <>
          <li>
            <NavLink to="Messeges">Messeges</NavLink>
          </li>
        </>
      );
    }
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="Register">Register</NavLink>
          </li>
          <li>
            <NavLink to="Login">Login</NavLink>
          </li>
          {shouldRenderNewListItems()}
          <li>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                name="search-params"
                value={searchParameters}
                onChange={handleChange}
              />
              <button>Wyszukaj</button>
            </form>
          </li>
        </ul>
      </nav>
      {shouldRenderUser()}
    </div>
  );
};

export default Navbar;
