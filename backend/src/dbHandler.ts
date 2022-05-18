import { Pool } from 'pg';
import 'dotenv/config';

const insertNewUser =
  'INSERT INTO user_accounts(username, email, password) VALUES($1, $2, $3) RETURNING *';

const createNewUser = async (userInformations: string[]): Promise<any> => {
  const pool = new Pool();
  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query(insertNewUser, userInformations, (error, response) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        console.log(response.rows[0]);
      }
    });
  });
};

export { createNewUser };
