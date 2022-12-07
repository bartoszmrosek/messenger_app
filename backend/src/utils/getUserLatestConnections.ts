import { MessageDetails, MySqlConnetion } from '../queries';

const getLastestConnections = async (userId: number) => {
  try {
    const messagesSearchResults = await MySqlConnetion.getUserLatestConnections(
      userId,
    );
    if (!Array.isArray(messagesSearchResults)) throw 500;
    // This would be unnecessary but i can`t make sql query any more accurate while beeing predictable as it is
    const deDuplicatingMap = new Map<string, MessageDetails>();
    messagesSearchResults.forEach(connection => {
      if (!deDuplicatingMap.has(connection.username)) {
        deDuplicatingMap.set(connection.username, connection);
      }
    });
    const arrOfMapValues: MessageDetails[] = [];
    deDuplicatingMap.forEach(value => {
      arrOfMapValues.push(value);
    });
    return arrOfMapValues;
  } catch (err) {
    console.log('[utils][getUserLatestConnections] error: ', err);
    return 500;
  }
};

export default getLastestConnections;
