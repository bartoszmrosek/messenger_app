/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DbQueries } from '../queries';

const checkUserHistory = async (
  userId: number,
  callback: any,
  db: DbQueries,
) => {
  const messagesSearchResults = await db.searchUserMessagesHistory(userId);
  console.log(`[utils][checkUserHistory]: `, messagesSearchResults);
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
