/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DbQueries } from '../queries';

const getLastestConnections = async (userId: number, db: DbQueries) => {
  try {
    const messagesSearchResults = await db.getUserLatestConnections(userId);
    console.log(messagesSearchResults);
    if (!Array.isArray(messagesSearchResults)) throw 500;
    return messagesSearchResults;
  } catch (err) {
    console.log('[utils][getUserLatestConnections] error: ', err);
    return 500;
  }
};

export default getLastestConnections;
