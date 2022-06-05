import React from 'react';
import type { userMessagesTypes } from '../Contexts/UserContext';

interface UserActiveChatsInterface {
  groupedUsers: userMessagesTypes[];
  handleChatChange: (user_id: number) => void;
  userToSendMessageTo: (userNode: userMessagesTypes) => number;
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
          It's seems that you don't have any conversations yet, make some!
        </div>
      ) : (
        groupedUsers.map(userNode => {
          return (
            <section key={userNode.created_at}>
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
