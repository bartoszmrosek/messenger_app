import {NavLink} from 'react-router-dom';
import React, {useContext} from 'react'
import { UserContext } from '../Contexts/UserContext';

const Navbar = () =>{
    const loggedUser:any = useContext(UserContext)
    const shouldRenderUser = () =>{
        if(loggedUser.userInformations.user_id !== undefined){
            return (
                <section>
                    <h1>Username: {loggedUser.userInformations.username}</h1>
                    <h3>Email: {loggedUser.userInformations.email}</h3>
                </section>
            )
        }
    }
    return(
        <div>
            <nav>
                <ul>
                    <li>
                        <NavLink to="Register">Register</NavLink>
                    </li>
                    <li>
                        <NavLink to="Login">Login</NavLink>
                    </li>
                </ul>
            </nav>
            {shouldRenderUser()}
        </div>
    )
}

export default Navbar;