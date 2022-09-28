/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DbQueries } from '../queries';

const searchUser = async (username: string, callback: any, db: DbQueries) => {
  try {
    const searchResults = await db.searchUser(username);
    if (Array.isArray(searchResults)) {
      callback({ type: 'confirm', payload: searchResults });
    } else {
      callback({ type: 'error', payload: searchResults });
    }
  } catch (err) {
    console.log('[utils][searchUser] error: ', err);
    callback({
      type: 'error',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      payload: err,
    });
  }
};

export default searchUser;
