import { NavLink } from 'react-router-dom';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

import type { exportUserContextTypes } from '../Contexts/UserContext';

const Navbar = () => {
  const { userInformations }: exportUserContextTypes = useContext(UserContext);
  const [searchParameters, setSearchParameters] = useState<string>('');
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.setCustomValidity('');
  }, [searchParameters]);

  const handleChange = (
    inputValue: React.FormEvent<HTMLInputElement>,
  ): void => {
    setSearchParameters(inputValue.currentTarget.value);
  };

  const handleSearchSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (searchParameters.length > 0) {
      navigate('/SearchResults', { state: { searchParameters, id: nanoid() } });
    } else {
      searchRef.current?.setCustomValidity('Cannot be empty');
    }
  };

  const shouldRenderUser = () => {
    if (userInformations !== undefined) {
      return (
        <li>
          <h1>Username: {userInformations.username}</h1>
          <h3>Email: {userInformations.email}</h3>
        </li>
      );
    }
  };

  const shouldRenderNewListItems = () => {
    if (userInformations !== undefined) {
      return (
        <li>
          <NavLink to="Messeges">Messeges</NavLink>
        </li>
      );
    }
  };

  return (
    <nav className="z-10 fixed w-screen mb-5">
      <section className="grid grid-cols-2 grid-rows-2 gap-3 items-center justify-end md:flex md:flex-row m-5 font-semibold text-[#371965] text-center">
        <NavLink
          to="Register"
          className="transition duration-1000 p-1 md:p-2 rounded-2xl bg-[#EBECED] border-4
         hover:border-green-400 hover:border-solid hover:border-4 md:bg-main-purple md:text-[#EBECED] w-3/5 md:min-w-[6rem] md:w-[10%] lg:w-[6%] justify-self-center md:order-2"
        >
          Register
        </NavLink>
        <NavLink
          to="Login"
          className="transition duration-1000 p-1 md:p-2 rounded-2xl border-4 border-[#ad79fd] hover:border-green-400 w-3/5 md:min-w-[6rem] md:w-[10%] lg:w-[6%] justify-self-center md:order-last"
        >
          Login
        </NavLink>
        <div className="col-span-2">
          <form onSubmit={handleSearchSubmit}>
            <input
              className="transition duration-1000 p-2 md:p-3 rounded-full focus:outline-none focus:ring
               focus:ring-main-purple/50 invalid:focus:ring-red-600 border-2 hover:border-main-purple invalid:hover:border-red-600"
              type="search"
              name="search-params"
              value={searchParameters}
              onChange={handleChange}
              placeholder={'Search'}
              ref={searchRef}
            />
          </form>
        </div>
      </section>
      {shouldRenderNewListItems()}
      {shouldRenderUser()}
    </nav>
  );
};

export default Navbar;
