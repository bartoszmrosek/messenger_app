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
  const [filteredMessages, setFilteredMessages] =
    useState<userMessagesTypes[]>();
  const [groupedUsers, setGroupedUsers] = useState<userMessagesTypes[]>();
  const [newMessageValue, setNewMessageValue] = useState<string>('');

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

  useEffect(() => {
    const uniqueUser: any[] = [];
    if (userMessages !== undefined) {
      const uniqueUsers = userMessages.filter(element => {
        const isDuplicate = uniqueUser.includes(element.user_id);
        if (!isDuplicate) {
          uniqueUser.push(element.user_id);
          return true;
        }
        return false;
      });
      setGroupedUsers(uniqueUsers);
    }
  }, [userMessages]);

  const handleChatChange = (user_id: number) => {
    setActiveChat(user_id);
  };
  const filterMessages = (
    messages: userMessagesTypes[],
    activeChat: number,
  ) => {
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

  const handleInput = (inputValue: React.FormEvent<HTMLInputElement>) => {
    setNewMessageValue(inputValue.currentTarget.value);
  };

  const sendNewMessage = () => {
    if (newMessageValue.length > 0) {
      standardSocket.emit(
        'newMessage',
        {
          user_id: userInformations?.user_id,
          message: newMessageValue,
        },
        (ack: string) => {
          setNewMessageValue(ack);
        },
      );
    }
  };

  return (
    <div>
      {groupedUsers !== undefined &&
        (groupedUsers.length === 0 ? (
          <div>
            It's seems that you don't have any conversations yet, make some!
          </div>
        ) : (
          groupedUsers.map((userNode, index) => {
            return (
              <section key={index}>
                <div>
                  <h3>{userNode.username}</h3>
                  <button onClick={() => handleChatChange(userNode.user_id)}>
                    Pick chat
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
              <div>
                {filteredMessages.map(message => {
                  return (
                    <Message
                      key={message.created_at}
                      message={message.message_sent}
                      isRecieved={false}
                    />
                  );
                })}
                <input
                  name="newMessage"
                  onChange={handleInput}
                  value={newMessageValue}
                />
                <button onClick={sendNewMessage}>Send message</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Messeges;
