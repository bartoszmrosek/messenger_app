import { Pool } from 'pg';
import 'dotenv/config';

const insertNewUser =
  'INSERT INTO user_accounts(username, email, password) VALUES($1, $2, $3) RETURNING *';
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

export { createNewUser };
