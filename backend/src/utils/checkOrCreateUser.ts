import { UserDetails } from '../queries';
import { DbConnection } from '../app';

const checkOrCreateUser = async (data: UserDetails) => {
  try {
    await DbConnection.insertNewUser(data);
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
