import React, { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../Contexts/SocketContext';
import { UserContext } from '../Contexts/UserContext';
import type {
  userMessagesTypes,
  exportUserContextTypes,
} from '../Contexts/UserContext';
import Message from '../components/Message';

const Messeges = () => {
  const {
    userInformations,
    userMessages,
    handleNewMessage,
  }: exportUserContextTypes = useContext(UserContext);
  const { standardSocket }: any = useContext(SocketContext);
  const [activeChat, setActiveChat] = useState<number>();
  const [filteredMessages, setFilteredMessages] = useState<userMessagesTypes[]>();

  useEffect(() => {
    if (userInformations?.user_id !== undefined) {
      standardSocket.emit(
        'checkUserHistory',
        userInformations.user_id,
        (response: any[] | 'error') => {
          if (response === 'error') {
            console.log(response);
          } else {
            if (handleNewMessage !== undefined) {
              handleNewMessage(response);
            }
          }
        },
      );
    }
  }, []);
  useEffect(() => {
    if (activeChat !== undefined) {
      if (userMessages !== undefined) {
        setFilteredMessages(filterMessages(userMessages, activeChat));
      }
    }
  }, [activeChat]);

  const handleChatChange = (user_id: number) => {
    setActiveChat(user_id);
  };
  const filterMessages = (
    messages: userMessagesTypes[],
    activeChat: number,
  ) => {
    console.log(messages);
    return messages.filter(message => {
      if (
        (activeChat === message.sender &&
          userInformations?.user_id === message.reciever) ||
        (userInformations?.user_id === message.sender &&
          activeChat === message.sender)
      ) {
        return message;
      }
    });
  };
  console.log(filteredMessages)
  return (
    <div>
      {userMessages !== undefined &&
        (userMessages.length === 0 ? (
          <div>
            It's seems that you don't have any conversations yet, make some!
          </div>
        ) : (
          userMessages.map((userNode, index )=> {
            return (
              <section key={index}>
                <div>
                  <h3>{userNode.username}</h3>
                  <button onClick={() => handleChatChange(userNode.user_id)}>
                    Wybierz czat
                  </button>
                </div>
              </section>
            );
          })
        ))}
      <div>
        {activeChat !== undefined && filteredMessages !== undefined && (
          <div>
            {filteredMessages.length > 0 && (
              filteredMessages.map((message)=>{
                return(
                <Message
                key={message.message_sent}
                message={message.message_sent}
                isRecieved={false}
              />
              )
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Messeges;
