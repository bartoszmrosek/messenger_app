import { Pool } from 'pg';
import 'dotenv/config';

const insertNewUser =
  'INSERT INTO user_accounts(username, email, password) VALUES($1, $2, $3) RETURNING *';
const checkUser =
  'SELECT user_id, username, email, password FROM user_accounts WHERE email = $1 AND password = $2';
const searchUserQuery =
  'SELECT user_id, username FROM user_accounts WHERE username LIKE $1'

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

export { createNewUser, loginUser, searchUser };
