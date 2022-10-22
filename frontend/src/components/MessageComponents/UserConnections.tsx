import React from 'react';
import { userMessageInterface } from '../../Contexts/UserContext';

interface UserConnectionsProps {
  loggedUserId: number;
  groupedUsers: userMessageInterface[];
  handleChatChange: (user_id: number) => void;
}

const UserConnections = ({
  loggedUserId,
  groupedUsers,
  handleChatChange,
}: UserConnectionsProps) => {
  const userToSendMessageTo = (userNode: userMessageInterface): number => {
    if (loggedUserId === userNode.reciever_user_id) {
      return userNode.sender_user_id;
    } else {
      return userNode.reciever_user_id;
    }
  };
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
export default UserConnections;
