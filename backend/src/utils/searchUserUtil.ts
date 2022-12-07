import { MySqlConnetion } from '../queries';

const searchUserUtil = async (username: string) => {
  try {
    const searchResults = await MySqlConnetion.searchUser(username);
    if (Array.isArray(searchResults)) {
      return searchResults;
    }
    return 500;
  } catch (err) {
    console.log('[utils][searchUser] error: ', err);
    return 500;
  }
};

export default searchUserUtil;
