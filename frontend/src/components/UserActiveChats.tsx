import React from 'react';
import { userMessageInterface } from '../Contexts/UserContext';

interface UserActiveChatsInterface {
  groupedUsers: userMessageInterface[];
  handleChatChange: (user_id: number) => void;
  userToSendMessageTo: (userNode: userMessageInterface) => number;
}

const UserActiveChats = ({
  groupedUsers,
  handleChatChange,
  userToSendMessageTo,
}: UserActiveChatsInterface) => {
  return (
    <>
      {groupedUsers.length === 0 ? (
        <div>
          It seems that you don{'&apos'}t have any conversations yet, make some!
        </div>
      ) : (
        groupedUsers.map(userNode => {
          return (
            <section key={userNode.message_id}>
              <div>
                <h3>{userNode.username}</h3>
                <button
                  onClick={() =>
                    handleChatChange(userToSendMessageTo(userNode))
                  }
                >
                  Pick chat
                </button>
              </div>
            </section>
          );
        })
      )}
    </>
  );
};
export default UserActiveChats;
