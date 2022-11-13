/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DbQueries, UserDetails } from '../queries';

const checkOrCreateUser = async (data: UserDetails, db: DbQueries) => {
  try {
    await db.insertNewUser(data);
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
