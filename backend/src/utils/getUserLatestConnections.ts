/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DbQueries } from '../queries';

const getLastestConnections = async (
  userId: number,
  callback: any,
  db: DbQueries,
) => {
  try {
    const messagesSearchResults = await db.getUserLatestConnections(userId);
    if (Array.isArray(messagesSearchResults)) {
      if (messagesSearchResults.length > 0) {
        callback({
          type: 'confirm',
          payload: messagesSearchResults,
        });
      } else {
        callback({
          type: 'confirm',
          payload: messagesSearchResults,
        });
      }
    }
  } catch (err) {
    console.log('[utils][checkUserHistory] error: ', err);
    callback({
      type: 'error',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      payload: err,
    });
  }
};

export default getLastestConnections;
