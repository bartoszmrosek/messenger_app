/* eslint-disable @typescript-eslint/no-unsafe-call */
import { dbQueries, userDetails } from '../queries';

const checkOrCreateUser = async (
  data: userDetails,
  callback: any,
  db: dbQueries,
) => {
  try {
    const queryResults = await db.insertNewUser(data);
    if (queryResults === null) {
      callback({ type: 'confirm', payload: null });
    } else {
      callback({ type: 'error', payload: queryResults });
    }
  } catch (error) {
    callback({
      type: 'error',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      payload: error,
    });
  }
};

export default checkOrCreateUser;
