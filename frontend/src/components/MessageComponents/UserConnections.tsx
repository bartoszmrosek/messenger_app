import React from 'react';
import { userMessageInterface } from '../../Contexts/UserContext';
import SvgIcons from '../SvgIcons';
import moment from 'moment';

interface UserConnectionsProps {
  loggedUserId: number;
  connections: userMessageInterface[];
  handleChatChange: (userToSendMessage: {
    userId: number;
    username: string;
  }) => void;
}

const UserConnections = ({
  loggedUserId,
  connections,
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
      {connections.length < 1 ? (
        <div className="h-full w-full flex justify-center items-center text-center p-10 text-lg">
          It seems that you don`t have any conversations yet, search for user to
          chat with!
        </div>
      ) : (
        <section className="flex flex-col gap-3 h-full w-full items-center divide-y-2 divide-slate-100 p-5 md:w-3/12">
          {connections.map(userNode => {
            return (
              <button
                key={userNode.message_id}
                onClick={() =>
                  handleChatChange({
                    userId: userToSendMessageTo(userNode),
                    username: userNode.username,
                  })
                }
                className="h-16 w-full flex flex-row justify-start items-center first-of-type:md:mt-20"
              >
                <SvgIcons type="user" className="h-16 w-16" />
                <div className="flex flex-row justify-between w-full text-justify overflow-x-clip items-end">
                  <span className="truncate whitespace-nowrap">
                    <h3 className="font-bold text-lg capitalize">
                      {userNode.username}
                    </h3>
                    {userNode.message !== null && (
                      <p className="truncate text-black/50">
                        {userNode.sender_user_id === loggedUserId && 'You: '}
                        {userNode.message}
                      </p>
                    )}
                  </span>
                  {userNode.message !== null && (
                    <p className="m-1 text-sm text-black/50 whitespace-nowrap">
                      {moment(userNode.created_at).fromNow()}
                    </p>
                  )}
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
