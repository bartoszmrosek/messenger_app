import { NavLink } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { UserContext } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

import type { exportUserContextTypes } from '../Contexts/UserContext';

const Navbar = () => {
  const { userInformations }: exportUserContextTypes = useContext(UserContext);
  const [searchParameters, setSearchParameters] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (
    inputValue: React.FormEvent<HTMLInputElement>,
  ): void => {
    setSearchParameters(inputValue.currentTarget.value);
  };

  const handleSearchSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    navigate('/SearchResults', { state: { searchParameters, id: nanoid() } });
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
    <nav className="z-10 fixed w-screen">
      <ul className="flex flex-row justify-evenly m-5 font-semibold text-[#371965]">
        <li>
          <NavLink
            to="Register"
            className="transition duration-1000 p-2 rounded-2xl bg-[#EBECED] border-4 hover:border-green-600 hover:border-4 2xl:bg-main-purple 2xl:text-[#EBECED]"
          >
            Register
          </NavLink>
        </li>
        <li>
          <NavLink
            to="Login"
            className="transition duration-1000 p-2 rounded-2xl border-4 border-[#ad79fd] hover:border-green-600"
          >
            Login
          </NavLink>
        </li>
        {shouldRenderNewListItems()}
        <li className="hidden md:block">
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
      {shouldRenderUser()}
    </nav>
  );
};

export default Navbar;
