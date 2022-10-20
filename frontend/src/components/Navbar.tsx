import { NavLink } from 'react-router-dom';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext, UserContextExports } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { SocketContext } from '../Contexts/SocketContext';
import { Socket } from 'socket.io-client';
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../interfaces/socketContextInterfaces';
import useMedia from '../hooks/useMedia';
import SvgIcons from './SvgIcons';
import SearchOverlay from './SearchOverlay';

const Navbar = ({ shouldRender }: { shouldRender: boolean }) => {
  const { user, removeUser }: UserContextExports = useContext(UserContext);
  const standardSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
    useContext(SocketContext);
  const [searchParameters, setSearchParameters] = useState<string>('');
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const media = useMedia();

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

  const logoutUser = () => {
    if (user !== null && standardSocket.id !== null) {
      standardSocket.emit('logoutUser', { userId: user?.user_id });
      if (removeUser !== undefined) removeUser();
      navigate('/Login');
    }
  };

  const shouldRenderUser = () => {
    if (user !== undefined && user !== null && media !== 'sm') {
      return (
        <section className="flex flex-row">
          <SvgIcons type="user" />
          <section className="flex flex-col justify-center items-start">
            <h1>{user.username}</h1>
            <h3>{user.email}</h3>
          </section>
        </section>
      );
    }
  };

  const handleMobileSearch = () => {};

  return (
    <nav
      className={`z-10 fixed bottom-0 md:top-0 w-screen h-fit bg-main-purple md:bg-transparent ${
        !shouldRender && 'hidden md:block'
      }`}
    >
      <div
        className={`gap-3 items-center
        justify-end ${
          user && 'md:justify-between'
        } md:flex md:flex-row text-center`}
      >
        {shouldRenderUser()}
        <section
          className={`grid ${
            !user ? 'grid-cols-2' : 'grid-cols-3'
          } grid-rows-1 gap-5 items-center
        justify-end md:flex md:flex-row m-3 md:m-5 font-semibold text-[#371965]
        text-center`}
        >
          {!user ? (
            <>
              <NavLink
                to="Register"
                className="transition duration-1000 p-1 md:p-2 rounded-2xl border-4
         hover:border-green-400 hover:border-solid hover:border-4 bg-main-purple text-porcelain w-3/5 md:min-w-[6rem] md:w-[10%] lg:w-[6%] justify-self-center md:order-2"
              >
                Register
              </NavLink>
              <NavLink
                to="Login"
                className="transition duration-1000 p-1 md:p-2 rounded-2xl border-4 border-[#ad79fd] bg-porcelain hover:border-green-400 w-3/5 md:min-w-[6rem] md:w-[10%] lg:w-[6%] justify-self-center md:order-last"
              >
                Login
              </NavLink>
            </>
          ) : (
            <>
              <button
                className={`${
                  media !== 'sm'
                    ? 'transition duration-1000 p-1 md:p-2 rounded-2xl border-4 border-[#ad79fd] hover:border-green-400 w-3/5 md:min-w-[6rem] md:w-[10%] lg:w-[6%] justify-self-center md:order-last'
                    : 'justify-self-center align-middle order-last flex justify-center items-center w-full h-full'
                }`}
                onClick={logoutUser}
                title="Logout"
              >
                {media === 'sm' ? <SvgIcons type="logout" /> : 'Logout'}
              </button>
              {media !== 'sm' ? (
                <form onSubmit={handleSearchSubmit}>
                  <input
                    className="transition duration-1000 p-2 md:p-3 rounded-full focus:outline-none focus:ring
               focus:ring-main-purple/50 invalid:focus:ring-red-600 border-2 hover:border-main-purple invalid:hover:border-red-600"
                    type="search"
                    name="search-params"
                    value={searchParameters}
                    onChange={handleChange}
                    placeholder="Search"
                    ref={searchRef}
                  />
                </form>
              ) : (
                <button
                  className="justify-self-center w-full h-full flex justify-center items-center"
                  onClick={handleMobileSearch}
                >
                  <SvgIcons type="search" />
                </button>
              )}
            </>
          )}
          {user && (
            <NavLink
              to="Messeges"
              className="align-middle justify-self-center flex justify-center items-center md:block w-full h-full"
            >
              {media !== 'sm' ? 'Messages' : <SvgIcons type="messages" />}
            </NavLink>
          )}
        </section>
      </div>
      {media === 'sm' && <SearchOverlay media={media} />}
    </nav>
  );
};

export default Navbar;
