import {
  UserInfoWithPacket,
  UserLoginDetails,
  MySqlConnetion,
} from '../queries';

const checkUserLoginData = async (userLoginData: UserLoginDetails) => {
  try {
    const loginTryResult: UserInfoWithPacket | number =
      await MySqlConnetion.loginUser(userLoginData);
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
