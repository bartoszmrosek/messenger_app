/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DbQueries, userInfoWithPacket, userLoginDetails } from '../queries';

const checkUserLoginData = async (
  userLoginData: userLoginDetails,
  db: DbQueries,
) => {
  try {
    const loginTryResult: userInfoWithPacket | number = await db.loginUser(
      userLoginData,
    );
    if (typeof loginTryResult === 'number') {
      if (loginTryResult === 3) {
        return 401;
      }
      console.log(loginTryResult);
      return 400;
    } else {
      return {
        code: 200,
        results: loginTryResult,
      };
    }
  } catch (error) {
    console.log('[utils][checkUserLoginData] error: ', error);
    return 500;
  }
};

export default checkUserLoginData;
