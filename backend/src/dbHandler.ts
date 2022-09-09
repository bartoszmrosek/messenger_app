import mysql from 'mysql2';
import 'dotenv/config';
interface NewMessage {
  user_id: number;
  username: string;
  message: string;
  sender_user_id: number;
  reciever_user_id: number;
  is_read: boolean;
  created_at: string;
}

const insertNewUserQuery =
  'INSERT INTO user_accounts(username, email, password) VALUES(?, ?, ?) RETURNING *';
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

const dbConnection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  waitForConnections: true,
  connectionLimit: 60,
  ssl: {
    rejectUnauthorized: true,
  },
});

const createNewUser = async (userInformations: string[]) => {
  try {
    // const res = await client.query(insertNewUserQuery, userInformations);
    dbConnection.execute(
      insertNewUserQuery,
      userInformations,
      (error, results, fields) => {
        if (error) throw error;
        console.log(results);
        console.table(fields);
      },
    );
  } catch (error1) {
    console.error('Cannot connect to db:', error1);
    return error1;
  }
};

// const loginUser = async (userInformations: [string, string | number]) => {
//   try {
//     const client = await pool.connect();
//     try {
//       const res = await client.query(
//         checkUser(typeof userInformations[1] === 'number'),
//         userInformations,
//       );
//       if (res.rows.length === 0) {
//         return 3;
//       } else {
//         return res.rows[0];
//       }
//     } catch (error2) {
//       console.error('Login User Failed:', error2);
//       return 2;
//     } finally {
//       client.release();
//     }
//   } catch (error1) {
//     console.error('Cannot connect to db:', error1);
//     return 0;
//   }
// };

// const searchUser = async (username: string) => {
//   try {
//     const client = await pool.connect();
//     const chgToArr = [`%${username}%`];
//     try {
//       const res = await client.query(searchUserQuery, chgToArr);
//       return res;
//     } catch (error2) {
//       console.error('Searching user query not succesfull', error2);
//       return 'unknown';
//     } finally {
//       client.release();
//     }
//   } catch (error1) {
//     console.error('Cannot connect to db:', error1);
//     return 0;
//   }
// };

// const searchHistory = async (userId: number) => {
//   try {
//     const client = await pool.connect();
//     try {
//       const res = await client.query(searchUserMessageQuery, [userId]);
//       return res.rows;
//     } catch (error2) {
//       console.error('Searching for user history failed:', error2);
//       return 'unknown';
//     } finally {
//       client.release();
//     }
//   } catch (error1) {
//     console.error('Cannot connect to db:', error1);
//     return 0;
//   }
// };

// const saveNewMessageToDataBase = async (message: NewMessage) => {
//   try {
//     const client = await pool.connect();
//     const convertToArrayOfMessageParams = [
//       message.sender_user_id,
//       message.reciever_user_id,
//       message.message,
//       message.is_read,
//     ];
//     try {
//       await client.query(saveNewMessageQuery, convertToArrayOfMessageParams);
//     } catch (error2) {
//       console.error('Cannot save message to db:', error2);
//       return 4;
//     } finally {
//       client.release();
//     }
//   } catch (error1) {
//     console.error('Cannot connect to db:', error1);
//     return 0;
//   }
// };

export { createNewUser };
export type { NewMessage };
