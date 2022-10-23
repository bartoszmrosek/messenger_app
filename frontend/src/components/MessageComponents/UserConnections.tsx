import React from 'react';
import { userMessageInterface } from '../../Contexts/UserContext';
import SvgIcons from '../SvgIcons';
import moment from 'moment';

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
      {groupedUsers.length < 1 ? (
        <div className="h-full w-full flex justify-center items-center text-center p-10 text-lg">
          It seems that you don`t have any conversations yet, search for user to
          chat with!
        </div>
      ) : (
        <section className="flex flex-col gap-3 h-full w-full items-center divide-y-2 divide-slate-100 p-5">
          {groupedUsers.map(userNode => {
            return (
              <button
                key={userNode.message_id}
                onClick={() => handleChatChange(userToSendMessageTo(userNode))}
                className="h-16 w-full flex flex-row justify-start items-center"
              >
                <SvgIcons type="user" className="h-16 w-16" />
                <div className="flex flex-row justify-between w-full text-justify overflow-x-clip items-end">
                  <span className="truncate whitespace-nowrap">
                    <h3 className="font-bold text-lg">{userNode.username}</h3>
                    <p className="truncate text-black/50">
                      {userNode.sender_user_id === loggedUserId && 'You:'}
                      {userNode.message}
                    </p>
                  </span>
                  <p className="m-1 text-sm text-black/50">
                    {moment(userNode.created_at).fromNow()}
                  </p>
                </div>
              </button>
            );
          })}
        </section>
      )}
    </>
  );
};
export default UserConnections;
