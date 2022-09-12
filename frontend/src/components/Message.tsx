import React from 'react';

const Message = ({message}: {message: string, isRecieved: boolean})=>{
    return(
        <div>
            {message}
        </div>
    )
}
export default Message;