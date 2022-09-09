/* eslint-disable */
interface ConnectedUsersSpecs {
  userId: number;
  socketId: string;
}

let currentlyConnectedUsers: ConnectedUsersSpecs[] = [];

const connectUser = (userId: number, socketId: string) => {
  currentlyConnectedUsers.push({
    userId,
    socketId,
  });
};

const isUserAuthorized = (userId: unknown, socketId: string): boolean => {
  const check = currentlyConnectedUsers.some(connectedUser => {
    return (
      connectedUser.userId === userId && connectedUser.socketId === socketId
    );
  });
  return check;
};

const checkIsUserConnected = (
  userId: number,
): ConnectedUsersSpecs | 'Not connected' => {
  const isConnected = currentlyConnectedUsers.find(user => {
    return user.userId === userId;
  });
  if (isConnected !== undefined) {
    return isConnected;
  } else {
    return 'Not connected';
  }
};

const disconnectUser = (socketId: string) => {
  currentlyConnectedUsers = currentlyConnectedUsers.filter(user => {
    return user.socketId !== socketId;
  });
};

export { connectUser, isUserAuthorized, checkIsUserConnected, disconnectUser };
