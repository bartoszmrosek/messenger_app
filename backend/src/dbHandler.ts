import { Pool } from 'pg';
import 'dotenv/config';

const insertNewUser =
  'INSERT INTO user_accounts(username, email, password) VALUES($1, $2, $3) RETURNING *';
const checkUser =
  'SELECT user_id, username, email FROM user_accounts WHERE email = $1 AND password = $2';
const searchUserQuery =
  'SELECT user_id, username FROM user_accounts WHERE username LIKE $1';
const searchUserMessageQuery =
  `SELECT user_accounts.user_id, user_accounts.username, user_messages.message_sent, user_messages.sender, user_messages.reciever, user_messages.is_read, user_messages.created_at
  FROM user_accounts
  INNER JOIN user_messages ON user_accounts.user_id = user_messages.sender
  WHERE (user_messages.sender = $1 OR user_messages.reciever = $1) ORDER BY user_messages.created_at DESC`

const pool = new Pool();
const createNewUser = async (userInformations: string[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(insertNewUser, userInformations);
    client.release();
    console.log(res.rows[0]);
  } catch (err1) {
    client.release();
    return err1;
  }
};

const loginUser = async(userInformations: string[]) =>{
  const client = await pool.connect();
  try{
    const res = await client.query(checkUser, userInformations);
    client.release();
    return res.rows[0];
  }catch(error){
    client.release();
    return error;
  }
}

const searchUser = async(username: string)=>{
  const client = await pool.connect();
  const chgToArr = [`%${username}%`]
  try{
    const res = await client.query(searchUserQuery, chgToArr);
    client.release();
    return res.rows;
  }catch(error){
    client.release();
    console.log(error)
    return 'error';
  }
}

const searchUserMessages = async(userId:number)=>{
  const client = await pool.connect();
  try{
    const res = await client.query(searchUserMessageQuery, [userId]);
    client.release();
    return res.rows;
  }catch(error){
    client.release();
    console.log(error)
    return('error')
  }
}

export { createNewUser, loginUser, searchUser, searchUserMessages };
