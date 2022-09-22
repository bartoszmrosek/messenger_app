/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DbQueries } from '../queries';

const searchUser = async (username: string, callback: any, db: DbQueries) => {
  const searchResults = await db.searchUser(username);
  if (Array.isArray(searchResults)) {
    callback({ type: 'confirm', payload: searchResults });
  } else {
    callback({ type: 'error', payload: searchResults });
  }
};

export default searchUser;
