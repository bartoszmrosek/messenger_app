import { createNewUser } from '../dbHandler';
/* eslint-disable */

interface dataPassedFromSocket {
  username: string;
  email: string;
  password: string;
}

const checkOrCreateUser = (data: dataPassedFromSocket, callback: any) => {
  const userInformationsArray: string[] = [
    data.username,
    data.email,
    data.password,
  ];
  try {
    const results = createNewUser(userInformationsArray);
    if (results === undefined) {
      callback({
        type: 'confirm',
        payload: null,
      });
    } else {
      results === 1
        ? callback({
            type: 'error',
            payload: 1,
          })
        : callback({
            type: 'error',
            payload: 0,
          });
    }
  } catch (error) {
    callback({
      type: 'error',
      payload: error,
    });
  }
};

export default checkOrCreateUser;
