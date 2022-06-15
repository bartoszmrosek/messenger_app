import { Pool } from 'pg';
import 'dotenv/config';

interface NewMessage {
  username: string;
  message: string;
  sender_user_id: number;
  reciever_user_id: number;
  is_read: boolean;
  created_at: string;
}

const insertNewUserQuery =
  'INSERT INTO user_accounts(username, email, password) VALUES($1, $2, $3) RETURNING *';
const checkUser = (shouldUseUserId: boolean) => {
  if (shouldUseUserId) {
    return `SELECT user_id, username, email FROM user_accounts WHERE email = $1 AND user_id = $2`;
  } else {
    return `SELECT user_id, username, email FROM user_accounts WHERE email = $1 AND password = $2`;
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

const pool = new Pool();
const createNewUser = async (userInformations: string[]) => {
  try {
    const client = await pool.connect();
    try {
      const res = await client.query(insertNewUserQuery, userInformations);
      client.release();
      console.log(res.rows[0]);
    } catch (err1) {
      client.release();
      return err1;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};

const loginUser = async (userInformations: [string, string | number]) => {
  try {
    const client = await pool.connect();
    try {
      const res = await client.query(
        checkUser(typeof userInformations[1] === 'number'),
        userInformations,
      );
      client.release();
      return res.rows[0];
      
    } catch (error) {
      client.release();
      console.log('Login User Failed: ', error);
      return error;
    }
  } catch (err) {
    console.log("Db connection failed: ", err);
  }
};

const searchUser = async (username: string) => {
  const client = await pool.connect();
  const chgToArr = [`%${username}%`];
  try {
    const res = await client.query(searchUserQuery, chgToArr);
    client.release();
    return res.rows;
  } catch (error) {
    client.release();
    console.log(error);
    return 'error';
  }
};

const searchUserMessages = async (userId: number) => {
  const client = await pool.connect();
  try {
    const res = await client.query(searchUserMessageQuery, [userId]);
    client.release();
    return res.rows;
  } catch (error) {
    client.release();
    console.log(error);
    return 'error';
  }
};

const saveNewMessageToDataBase = async (message: NewMessage) => {
  const client = await pool.connect();
  const convertToArrayOfMessageParams = [
    message.sender_user_id,
    message.reciever_user_id,
    message.message,
    message.is_read,
  ];
  try {
    await client.query(saveNewMessageQuery, convertToArrayOfMessageParams);
    client.release();
  } catch (error) {
    client.release();
    console.log(error);
    return 'no i chuj';
  }
};

export {
  createNewUser,
  loginUser,
  searchUser,
  searchUserMessages,
  saveNewMessageToDataBase,
};
export type { NewMessage };
