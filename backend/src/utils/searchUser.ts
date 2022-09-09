/* eslint-disable */
import { searchUserInDb } from '../dbHandler';

const searchUser = async (data: any, callback: any) => {
  try {
    const callbackInfo: any | number | 'unknown' = await searchUserInDb(data);
    if (typeof callbackInfo !== 'number' && callbackInfo !== 'unknown') {
      callback({
        type: 'confirm',
        payload: callbackInfo.rows,
      });
    } else {
      callback({
        type: 'error',
        payload: callbackInfo,
      });
    }
  } catch (error) {
    callback({
      type: 'error',
      payload: error,
    });
  }
};

export default searchUser;
