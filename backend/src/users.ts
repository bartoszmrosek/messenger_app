/* eslint-disable */
interface ConnectedUsersSpecs {
  userId: number;
  socketId: string;
}

export class Users {
  #currentlyConnectedUsers: ConnectedUsersSpecs[] = [];
  connectUser = (userId: number, socketId: string) => {
    console.log('Connecting user');
    if (!this.#currentlyConnectedUsers.some(user => user.userId === userId)) {
      this.#currentlyConnectedUsers.push({
        userId,
        socketId,
      });
    }
  };

  isUserAuthorized = (userId: unknown, socketId: string): boolean => {
    console.log('Check authorize');
    const check = this.#currentlyConnectedUsers.some(connectedUser => {
      return (
        connectedUser.userId === userId && connectedUser.socketId === socketId
      );
    });
    console.log(check);
    return check;
  };

  checkIsUserConnected = (
    userId: number,
  ): ConnectedUsersSpecs | 'Not connected' => {
    const isConnected = this.#currentlyConnectedUsers.find(user => {
      return user.userId === userId;
    });
    if (isConnected !== undefined) {
      return isConnected;
    } else {
      return 'Not connected';
    }
  };

  logoutUser = (userId: number, socketId: string) => {
    this.#currentlyConnectedUsers = this.#currentlyConnectedUsers.filter(
      user => {
        return user.socketId !== socketId && user.userId !== userId;
      },
    );
  };

  disconnectUser = (socketId: string) => {
    this.#currentlyConnectedUsers = this.#currentlyConnectedUsers.filter(
      user => {
        return user.socketId !== socketId;
      },
    );
  };
}
