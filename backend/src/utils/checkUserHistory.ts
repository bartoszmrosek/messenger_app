import { searchHistory } from '../dbHandler';

const checkUserHistory = async (data: any, callback: any) => {
  try {
    const callbackInfo: any[] | 'unknown' | 0 = await searchHistory(data);
    if (callbackInfo !== 'unknown' && callbackInfo !== 0) {
      callback({
        type: 'confirm',
        payload: callbackInfo,
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

export default checkUserHistory;
