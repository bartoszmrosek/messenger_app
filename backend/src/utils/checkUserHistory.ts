/* eslint-disable */
import { dbQueries } from '../queries';
import { searchHistory } from '../dbHandler';

const checkUserHistory = async (
  userId: number,
  callback: any,
  db: dbQueries,
) => {
  const messagesSearchResults = await db.searchUserMessagesHistory(userId);
  if (Array.isArray(messagesSearchResults)) {
    if (messagesSearchResults.length > 0) {
      callback({
        type: 'confirm',
        payload: messagesSearchResults,
      });
    } else {
      callback({
        type: 'error',
        payload: messagesSearchResults,
      });
    }
  }
};

export default checkUserHistory;
