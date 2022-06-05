import { Pool } from 'pg';
import 'dotenv/config';

const insertNewUser =
  'INSERT INTO user_accounts(username, email, password) VALUES($1, $2, $3) RETURNING *';
const checkUser =
  'SELECT user_id, username, email FROM user_accounts WHERE email = $1 AND password = $2';
const searchUserQuery =
  'SELECT user_id, username FROM user_accounts WHERE username LIKE $1';
const searchUserMessageQuery = `SELECT user_accounts.username, user_messages.message, user_messages.sender_user_id, user_messages.reciever_user_id, user_messages.is_read, user_messages.created_at
  FROM user_accounts, user_messages
  WHERE (user_messages.reciever_user_id = $1 AND user_messages.sender_user_id = user_accounts.user_id) OR
  (user_messages.sender_user_id = $1 AND user_messages.reciever_user_id = user_accounts.user_id)
  ORDER BY user_messages.created_at ASC`;

const pool = new Pool();
const createNewUser = async (userInformations: string[]) => {
  try{
    const client = await pool.connect();
    try {
      const res = await client.query(insertNewUser, userInformations);
      client.release();
      console.log(res.rows[0]);
    } catch (err1) {
      client.release();
      return err1;
    }
  }catch(err){
    console.log(err)
  }
};

const loginUser = async (userInformations: string[]) => {
  try{
    const client = await pool.connect();
    try {
      const res = await client.query(checkUser, userInformations);
      client.release();
      return res.rows[0];
    } catch (error) {
      client.release();
      return error;
    }
  }catch(err){
    console.log(err)
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

export { createNewUser, loginUser, searchUser, searchUserMessages };
