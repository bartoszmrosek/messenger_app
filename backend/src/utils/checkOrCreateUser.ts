/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DbQueries, userDetails } from '../queries';

const checkOrCreateUser = async (
  data: userDetails,
  callback: any,
  db: DbQueries,
) => {
  try {
    await db.insertNewUser(data);
    callback({ type: 'confirm', payload: null });
  } catch (error) {
    if (
      typeof error === 'object' &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Object.hasOwn(error, 'errno') &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      error.errno === -4078
    ) {
      callback({ type: 'error', payload: 0 });
    } else {
      callback({ type: 'error', payload: error });
    }
  }
};

export default checkOrCreateUser;
