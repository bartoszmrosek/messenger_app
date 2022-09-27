/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { connectUser } from '../users';
import { DbQueries, userInfoWithPacket, userLoginDetails } from '../queries';

const checkUserLoginData = async (
  userLoginData: userLoginDetails,
  callback: any,
  socketId: string,
  db: DbQueries,
) => {
  try {
    const loginTryResult: userInfoWithPacket | number = await db.loginUser(
      userLoginData,
    );
    console.log(loginTryResult);
    if (typeof loginTryResult === 'number') {
      if (loginTryResult === 3) {
        callback({
          type: 'error',
          payload: 2,
        });
      } else {
        callback({
          type: 'error',
          payload: loginTryResult,
        });
      }
    } else {
      connectUser(loginTryResult.user_id, socketId);
      callback({
        type: 'confirm',
        payload: loginTryResult,
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
