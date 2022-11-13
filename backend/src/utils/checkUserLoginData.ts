/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DbQueries, UserInfoWithPacket, UserLoginDetails } from '../queries';

const checkUserLoginData = async (
  userLoginData: UserLoginDetails,
  db: DbQueries,
) => {
  try {
    const loginTryResult: UserInfoWithPacket | number = await db.loginUser(
      userLoginData,
    );
    if (typeof loginTryResult === 'number') {
      return 400;
    } else {
      return {
        code: 200,
        results: loginTryResult,
      };
    }
  } catch (error) {
    if (error === 3) {
      return 401;
    }
    console.log('[utils][checkUserLoginData] error: ', error);
    return 500;
  }
};

export default checkUserLoginData;
