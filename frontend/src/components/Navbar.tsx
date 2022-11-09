import { NavLink, useLocation } from 'react-router-dom';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext, UserContextExports } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import useMedia from '../hooks/useMedia';
import SvgIcons from './SvgIcons';
import SearchOverlay from './SearchComponents/SearchOverlay';

interface NavbarProps {
  shouldRender: boolean;
  setSearchOverlayOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ shouldRender, setSearchOverlayOpened }: NavbarProps) => {
  const { loggedUser, logoutUser: contextLogOut } = useContext(
    UserContext,
  ) as UserContextExports;
  const [searchInput, setSearchInput] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);
  const media = useMedia();
  const [isRenderedMobileSearch, setIsRenderedMobileSearch] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    searchRef.current?.setCustomValidity('');
  }, [searchInput]);

  useEffect(() => {
    setIsRenderedMobileSearch(null);
  }, [media]);

  const handleSearchChange = (
    inputValue: React.FormEvent<HTMLInputElement>,
  ): void => {
    setSearchInput(inputValue.currentTarget.value);
  };

  const handleSearchSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsRenderedMobileSearch(false);
    setSearchOverlayOpened(false);
    searchRef.current?.blur();
    if (searchInput.length > 0) {
      navigate(`/SearchResults/?username=${encodeURIComponent(searchInput)}`, {
        state: { searchInput, id: nanoid() },
      });
      setSearchInput('');
    } else {
      searchRef.current?.setCustomValidity('Cannot be empty');
    }
  };

  const logoutUser = () => {
    if (loggedUser !== null) {
      if (contextLogOut) contextLogOut();
      setIsRenderedMobileSearch(null);
      navigate('/Login');
    }
  };

  const shouldRenderUser = () => {
    if (
      //prettier-ignore
      loggedUser !== undefined &&
      loggedUser !== null &&
      (media !== 'sm' &&
      media !== 'md')
    ) {
      const fillingColor =
        location.pathname === '/SearchResults/' ||
        location.pathname === '/Messages'
          ? 'main-purple'
          : 'porcelain';
      return (
        <section className={`flex flex-row text-${fillingColor}`}>
          <SvgIcons type="user" className={`w-20 h-20 fill-${fillingColor}`} />
          <section className="flex flex-col justify-center items-start">
            <h1>{loggedUser.username}</h1>
            <h3>{loggedUser.email}</h3>
          </section>
        </section>
      );
    }
  };

  const handleMobileSearch = () => {
    setIsRenderedMobileSearch(true);
    searchRef.current?.focus();
  };

  return (
    <nav
      className={`z-50 fixed bottom-0 md:top-0 w-screen h-fit bg-main-purple ${
        location.pathname === '/Register' ||
        location.pathname === '/Login' ||
        location.pathname === '/'
          ? 'md:bg-transparent'
          : 'md:bg-porcelain'
      } ${!shouldRender && 'hidden md:block'}`}
    >
      <div
        className={`gap-3 items-center justify-end md:flex md:flex-row text-center 
        ${loggedUser && 'md:justify-between'}`}
      >
        {shouldRenderUser()}
        <section
          className={`grid ${
            !loggedUser ? 'grid-cols-2' : 'grid-cols-3'
          } grid-rows-1 gap-5 items-center
        justify-end md:flex md:flex-row m-3 md:m-5 font-semibold text-[#371965]
        text-center`}
        >
          {!loggedUser ? (
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
                  //prettier-ignore
                  (media !== 'sm' && media !== 'md')
                    ? 'transition duration-1000 p-1 md:p-2 rounded-2xl border-4 border-[#ad79fd] hover:border-green-400 w-3/5 md:min-w-[6rem] md:w-[10%] lg:w-[6%] justify-self-center md:order-last'
                    : 'justify-self-center align-middle order-last flex justify-center items-center w-full h-full'
                }`}
                onClick={logoutUser}
                title="Logout"
              >
                {
                  //prettier-ignore
                  (media === 'sm' || media === 'md') ? (
                  <SvgIcons
                    type="logout"
                    className="w-6 h-6 fill-porcelain overflow-hidden align-middle"
                  />
                ) : (
                  'Logout'
                )
                }
              </button>
              {
                //prettier-ignore
                (media !== 'sm' && media !== 'md') ? (
                <form onSubmit={handleSearchSubmit}>
                  <input
                    className="transition duration-1000 p-2 md:p-3 rounded-full focus:outline-none focus:ring
               focus:ring-main-purple/50 invalid:focus:ring-red-600 border-2 hover:border-main-purple invalid:hover:border-red-600"
                    type="search"
                    name="search-params"
                    value={searchInput}
                    onChange={handleSearchChange}
                    placeholder="Search"
                    ref={searchRef}
                  />
                </form>
              ) : (
                <button
                  className="justify-self-center w-full h-full flex justify-center items-center"
                  onClick={handleMobileSearch}
                >
                  <SvgIcons
                    type="search"
                    className="w-6 h-6 fill-porcelain overflow-hidden align-middle justify-self-center"
                  />
                </button>
              )
              }
            </>
          )}
          {loggedUser && (
            <NavLink
              to="Messages"
              className="align-middle justify-self-center flex justify-center items-center md:block w-full h-full"
            >
              {
                //prettier-ignore
                (media !== 'sm' && media !== 'md') ? (
                'Messages'
              ) : (
                <SvgIcons
                  type="messages"
                  className="w-12 h-12 fill-porcelain overflow-hidden align-middle justify-self-center"
                />
              )
              }
            </NavLink>
          )}
        </section>
      </div>
      {(media === 'sm' || media === 'md') && (
        <SearchOverlay
          setSearchOverlayOpened={setSearchOverlayOpened}
          handleChange={handleSearchChange}
          searchParameters={searchInput}
          searchRef={searchRef}
          handleSearchSubmit={handleSearchSubmit}
          isRenderedMobile={isRenderedMobileSearch}
          setIsRenderedMobile={setIsRenderedMobileSearch}
        />
      )}
    </nav>
  );
};

export default Navbar;
