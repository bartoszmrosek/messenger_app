import { NavLink } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { UserContext } from '../Contexts/UserContext';

const Navbar = () => {
  const loggedUser: any = useContext(UserContext);
  const [searchParameters, setSearchParameters] = useState<string>();

  

  const shouldRenderUser = () => {
    if (loggedUser.userInformations.user_id !== undefined) {
      return (
        <section>
          <h1>Username: {loggedUser.userInformations.username}</h1>
          <h3>Email: {loggedUser.userInformations.email}</h3>
        </section>
      );
    }
  };

  const shouldRenderNewListItems = () =>{
    if(loggedUser.userInformations.user_id !== undefined){
      return(
        <>
          <li><NavLink to='Messeges'>Messeges</NavLink></li>
          <li>
            <form>
              <input 
                type="text"
                name="search-params"
              />
              <button>Wyszukaj</button>
            </form>
          </li>
        </>
      )
    }
  }

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
        </ul>
      </nav>
      {shouldRenderUser()}
    </div>
  );
};

export default Navbar;
