import mysql, { RowDataPacket } from 'mysql2';
import 'dotenv/config';
import { off } from 'process';
/* eslint-disable */

/* 
    Error types are as following:
    0 - Error with connection to database
    1 - User already exists in database
    2 - Login failed
    3 - User does not exist or informations are wrong
    4 - Server couldn't save message to database, 
    although it still can process informations in real time
    5 - User doesn't have authorization for this action
*/
export interface NewMessage {
  user_id: number;
  username: string;
  message: string;
  sender_user_id: number;
  reciever_user_id: number;
  is_read: boolean;
  created_at: string;
}

export interface userSpecificData extends RowDataPacket {
  user_id: number;
  username: string;
  email: string;
}

const insertNewUserQuery =
  'INSERT INTO user_accounts(username, email, password) VALUES(?, ?, ?)';
const checkUser = (shouldUseUserId: boolean) => {
  if (shouldUseUserId) {
    return `SELECT user_id, username, email FROM user_accounts WHERE email = ? AND user_id = ?`;
  } else {
    return `SELECT user_id, username, email FROM user_accounts WHERE email = ? AND password = ?`;
  }
};
const searchUserQuery =
  'SELECT user_id, username FROM user_accounts WHERE username LIKE $1';
const searchUserMessageQuery = `SELECT
    user_accounts.username,
    user_messages.message,
    user_messages.sender_user_id,
    user_messages.reciever_user_id,
    user_messages.is_read,
    user_messages.created_at,
    user_messages.message_id
  FROM user_accounts, user_messages
  WHERE
  (user_messages.reciever_user_id = $1 AND user_messages.sender_user_id = user_accounts.user_id)
  OR
  (user_messages.sender_user_id = $1 AND user_messages.reciever_user_id = user_accounts.user_id)
  ORDER BY user_messages.created_at ASC`;
const saveNewMessageQuery = `
  INSERT INTO user_messages (sender_user_id, reciever_user_id, message, is_read)
  VALUES ( $1, $2, $3, $4 );`;

let dbConnection: mysql.Pool | null = null;

try {
  dbConnection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    ssl: {
      rejectUnauthorized: true,
    },
    port: 3306,
    connectTimeout: 30000,
  });
  console.log('MySql pool generated successfully');
} catch (error) {
  console.log(error);
}

const dbQuery = <paramsType, queryType>(
  query: string,
  params: paramsType[],
): queryType | unknown => {
  try {
    return dbConnection.execute(query, params, (error, results) => {
      if (error) throw error;
      return results;
    });
  } catch (error) {
    return error;
  }
};

const createNewUser = (userInformations: string[]): number | null => {
  const queryResult = dbQuery<string>(insertNewUserQuery, userInformations);
  try {
    dbConnection.execute(insertNewUserQuery, userInformations, error => {
      if (error) throw error;
    });
  } catch (error) {
    if ((error.errno = 1062)) return 1;
    return 0;
  }
  return null;
};

const loginUser = (userInformations: [string, string | number]) => {
  let results: userSpecificData[] | null = null;
  try {
    dbConnection.execute<userSpecificData[]>(
      checkUser(typeof userInformations[1] === 'number'),
      userInformations,
      (error, data) => {
        if (error) throw error;
        results = data;
      },
    );
  } catch (err) {
    return err;
  }
  if (results.length > 0) return results;
  return 2;
};

const searchUser = async (username: string) => {
  try {
    const client = await pool.connect();
    const chgToArr = [`%${username}%`];
    try {
      const res = await client.query(searchUserQuery, chgToArr);
      return res;
    } catch (error2) {
      console.error('Searching user query not succesfull', error2);
      return 'unknown';
    } finally {
      client.release();
    }
  } catch (error1) {
    console.error('Cannot connect to db:', error1);
    return 0;
  }
};

const searchHistory = async (userId: number) => {
  try {
    const client = await pool.connect();
    try {
      const res = await client.query(searchUserMessageQuery, [userId]);
      return res.rows;
    } catch (error2) {
      console.error('Searching for user history failed:', error2);
      return 'unknown';
    } finally {
      client.release();
    }
  } catch (error1) {
    console.error('Cannot connect to db:', error1);
    return 0;
  }
};

const saveNewMessageToDataBase = async (message: NewMessage) => {
  try {
    const client = await pool.connect();
    const convertToArrayOfMessageParams = [
      message.sender_user_id,
      message.reciever_user_id,
      message.message,
      message.is_read,
    ];
    try {
      await client.query(saveNewMessageQuery, convertToArrayOfMessageParams);
    } catch (error2) {
      console.error('Cannot save message to db:', error2);
      return 4;
    } finally {
      client.release();
    }
  } catch (error1) {
    console.error('Cannot connect to db:', error1);
    return 0;
  }
};

export {
  createNewUser,
  loginUser,
  searchUser as searchUserInDb,
  searchHistory,
  saveNewMessageToDataBase,
};
