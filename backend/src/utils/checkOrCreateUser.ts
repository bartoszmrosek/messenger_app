/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DbQueries, userDetails } from '../queries';

const checkOrCreateUser = async (data: userDetails, db: DbQueries) => {
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
