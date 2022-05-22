import { Pool } from 'pg';
import 'dotenv/config';

const insertNewUser =
  'INSERT INTO user_accounts(username, email, password) VALUES($1, $2, $3) RETURNING *';
const checkUser =
  'SELECT user_id, username, email, password FROM user_accounts WHERE email = $1 AND password = $2';

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

export { createNewUser, loginUser };
