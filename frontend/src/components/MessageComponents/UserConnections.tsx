import React from "react";
import SvgIcons from "../SvgIcons";
import moment from "moment";
import { UserMessageInterface } from "../../interfaces/MessageInterfaces";

interface UserConnectionsProps {
	loggedUserId: number;
	connections: UserMessageInterface[];
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
	const userToSendMessageTo = (userNode: UserMessageInterface): number => {
		if (loggedUserId === userNode.reciever_user_id) {
			return userNode.sender_user_id;
		} else {
			return userNode.reciever_user_id;
		}
	};
	return (
		<>
			{connections.length < 1 ? (
				<div className="h-full w-full max-w-md flex justify-center items-center text-center p-10 text-lg">
					It seems that you don`t have any conversations yet, search for user to
					chat with!
				</div>
			) : (
				<section className="flex flex-col gap-3 h-full w-full items-center divide-y-2 divide-slate-100 p-5 md:w-3/12 min-w-[18rem] overflow-auto pb-[5rem] md:pb-5">
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
									<span className="whitespace-nowrap min-w-[10%]">
										<h3 className="font-bold text-lg capitalize overflow-visible whitespace-normal z-20">
											{userNode.username}
										</h3>
										{userNode.message !== null && (
											<p className="truncate text-black/50">
												{userNode.sender_user_id === loggedUserId && "You: "}
												{userNode.message}
											</p>
										)}
									</span>
									{userNode.message !== null && (
										<p className="m-1 text-sm text-black/50 whitespace-wrap bg-transparent truncate min-w-fit">
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
