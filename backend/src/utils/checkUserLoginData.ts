import { connectUser } from '../users';
import { loginUser } from '../dbHandler';

interface UserDetails {
  user_id: number;
  username: string;
  email: string;
}

const checkUserLoginData = async (
  data: any,
  callback: any,
  socketId: string,
) => {
  const userInformations: [string, string | number] = [
    data.email,
    data.password,
  ];
  try {
    const callbackInfo: UserDetails | number = await loginUser(
      userInformations,
    );
    if (typeof callbackInfo === 'number') {
      switch (callbackInfo) {
        case 2:
          callback({
            type: 'error',
            payload: 2,
          });
          break;
        case 3:
          callback({
            type: 'error',
            payload: 3,
          });
          break;
        default:
          callback({
            type: 'error',
            payload: callbackInfo,
          });
          break;
      }
    } else {
      connectUser(callbackInfo.user_id, socketId);
      callback({
        type: 'confirm',
        payload: callbackInfo,
      });
    }
  } catch (error) {
    callback({
      type: 'error',
      payload: error,
    });
  }
};

export default checkUserLoginData;
