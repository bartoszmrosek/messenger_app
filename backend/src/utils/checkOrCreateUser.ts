import { createNewUser } from '../dbHandler';
/* eslint-disable */

interface dataPassedFromSocket {
  username: string;
  email: string;
  password: string;
}

const checkOrCreateUser = async (data: dataPassedFromSocket, callback: any) => {
  const userInformationsArray: string[] = [
    data.username,
    data.email,
    data.password,
  ];
  try {
    const informations = await createNewUser(userInformationsArray);
    if (informations === undefined) {
      callback({
        type: 'confirm',
        payload: null,
      });
    } else {
      informations.code === '23505'
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
