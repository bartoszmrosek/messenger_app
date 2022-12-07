import { UserDetails, MySqlConnetion } from '../queries';

const checkOrCreateUser = async (data: UserDetails) => {
  try {
    await MySqlConnetion.insertNewUser(data);
    return 200;
  } catch (error) {
    if (error === 1) {
      return 409;
    } else {
      console.log('[utils][checkOrCreateUser] error: ', error);
      return 500;
    }
  }
};

export default checkOrCreateUser;
