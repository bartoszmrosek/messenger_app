/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DbQueries } from '../queries';

const searchUser = async (username: string, db: DbQueries) => {
  try {
    const searchResults = await db.searchUser(username);
    if (Array.isArray(searchResults)) {
      return searchResults;
    }
    return 500;
  } catch (err) {
    console.log('[utils][searchUser] error: ', err);
    return 500;
  }
};

export default searchUser;
