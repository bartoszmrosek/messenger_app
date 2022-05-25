import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SocketContext } from "../Contexts/SocketContext";

const SearchResultsPage = () =>{
    const {standardSocket}:any = useContext(SocketContext)
    const {state}: any = useLocation();
    const [renderedResults, setRenderedResults] = useState<[] | React.ReactNode>()

    useEffect(()=>{
        standardSocket.emit('searchUser', state.searchParameters, (dbResponse: {user_id?: number, username?: string}[]) => {
            if(dbResponse.length > 0){
                const listOfMatchingUsers = dbResponse.map((element)=>{
                    return(
                        <section key={element.user_id}>
                            <h1>{element.username}</h1>
                        </section>
                    )
                })
                setRenderedResults(listOfMatchingUsers)
            }else{
                setRenderedResults(<div>Brak wyszukań</div>)
            }
          });
          
    }, [state.searchParameters])
    return(
        <div>
           {renderedResults}
        </div>
    )
}
export default SearchResultsPage;