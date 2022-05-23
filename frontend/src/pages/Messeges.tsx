import React, {useState, useContext, useEffect} from "react";
import { SocketContext } from "../Contexts/SocketContext";
import { UserContext } from "../Contexts/UserContext";

interface UserConnection {
    user_id: number,
    username: string,
    last_message: string,
    is_read: boolean
}

const Messeges = () =>{
    const {userInformations}:any = useContext(UserContext)
    const { standardSocket }:any = useContext(SocketContext)
    const [userConnections, setUserConnections] = useState([] as Array<UserConnection>);
    const [activeChat, setActiveChat] = useState<number>()

    useEffect(()=>{
        standardSocket.emit('checkUserHistory', userInformations.user_id, (
             error: unknown,
             data: UserConnection[]
             )=>{
                 if(error){
                    console.log(error)
                 }else{
                    setUserConnections(data)
                 }
        })
    }, [])

    function handleChatChange(user_id: number){
        setActiveChat(user_id)
    }
    return(
        <div>
            {
                userConnections.length === 0 ? 
                <div>
                    It's seems that you don't have any conversations yet, make some!
                </div>
                :
                userConnections.map((userNode)=>{
                    return(
                        <div>
                            <h3>{userNode.username}</h3>
                            <h4>{userNode.last_message}</h4>
                            <button onClick={()=>handleChatChange(userNode.user_id)}></button>
                        </div>
                    )
                })
            }
        </div>
    )
}
export default Messeges;