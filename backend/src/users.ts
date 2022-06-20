interface UserAuthorizationSpecs {
  userId: number;
  socketId: string;
}

let currentlyConnectedUsers: UserAuthorizationSpecs[] = [];

const connectUser = (userId: number, socketId: string) => {
  currentlyConnectedUsers.push({
    userId,
    socketId,
  });
  console.log(currentlyConnectedUsers);
};

const checkIsUserConnected = (
  userId: number,
): UserAuthorizationSpecs | 'Not connected' => {
  const isConnected = currentlyConnectedUsers.find(user => {
    return user.userId === userId;
  });
  if (isConnected !== undefined) {
    return isConnected;
  } else {
    return 'Not connected';
  }
  console.log(currentlyConnectedUsers);
};

const disconnectUser = (socketId: string) => {
  currentlyConnectedUsers = currentlyConnectedUsers.filter(user => {
    return user.socketId !== socketId;
  });
  console.log(currentlyConnectedUsers);
};

export { connectUser, checkIsUserConnected, disconnectUser };
