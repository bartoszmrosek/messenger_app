/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DbQueries, MessageDetails } from '../queries';

const getLastestConnections = async (userId: number, db: DbQueries) => {
  try {
    const messagesSearchResults = await db.getUserLatestConnections(userId);
    if (!Array.isArray(messagesSearchResults)) throw 500;
    // This would be unnecessary but i can`t make sql query any more accurate while beeing predictable as it is
    const deDuplicatingMap = new Map<string, MessageDetails>();
    messagesSearchResults.forEach(connection => {
      if (!deDuplicatingMap.has(connection.username)) {
        deDuplicatingMap.set(connection.username, connection);
      }
    });
    const ArrOfMapValues: MessageDetails[] = [];
    deDuplicatingMap.forEach(value => {
      ArrOfMapValues.push(value);
    });
    return ArrOfMapValues;
  } catch (err) {
    console.log('[utils][getUserLatestConnections] error: ', err);
    return 500;
  }
};

export default getLastestConnections;
