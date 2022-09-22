import mysql, { OkPacket, RowDataPacket } from 'mysql2';
export interface userInfoWithPacket extends RowDataPacket {
  username: string;
  password?: string;
  email?: string;
  user_id?: number;
}

export interface userDetails {
  username: string;
  password?: string;
  email?: string;
  user_id?: number;
}

export interface userLoginDetails {
  email: string;
  securityKey: number | string;
}

export interface messageDetails extends RowDataPacket {
  username: string;
  message: string;
  sender_user_id: number;
  reciever_user_id: number;
  is_read: boolean;
  created_at: Date;
  message_id: number;
}

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
  console.log('[dbHandler] MySql pool generated successfully');
} catch (error) {
  console.log('[dbHandler] Cannot estabilish a pool:', error);
}

export class dbQueries {
  #checkUser = (shouldUseUserId: boolean) => {
    if (shouldUseUserId) {
      return `SELECT user_id, username, email FROM user_accounts WHERE email = ? AND user_id = ?`;
    } else {
      return `SELECT user_id, username, email FROM user_accounts WHERE email = ? AND password = ?`;
    }
  };

  insertNewUser(newUserData: userDetails): Promise<number | null> {
    return new Promise((resolve, reject) => {
      dbConnection.execute<OkPacket>(
        'INSERT INTO user_accounts(username, email, password) VALUES(?, ?, ?)',
        [newUserData.username, newUserData.email, newUserData.password],
        err => {
          if (err.errno === 1062) reject(1);
          if (err) reject(err);
          resolve(null);
        },
      );
    });
  }
  loginUser(
    userLoginData: userLoginDetails,
  ): Promise<userInfoWithPacket | number> {
    return new Promise((resolve, reject) => {
      dbConnection.execute<userInfoWithPacket[]>(
        this.#checkUser(typeof userLoginData.securityKey === 'number'),
        [userLoginData.email, userLoginData.securityKey],
        (err, res) => {
          if (err) reject(err);
          if (!res[0]) reject(3);
          resolve(res[0]);
        },
      );
    });
  }
  searchUser(username: string): Promise<userDetails[]> {
    return new Promise((resolve, reject) => {
      dbConnection.execute<userInfoWithPacket[]>(
        'SELECT user_id, username FROM user_accounts WHERE username LIKE ?',
        username,
        (err, res) => {
          if (err) reject(err);
          resolve(res);
        },
      );
    });
  }
  searchUserMessagesHistory(userId: number): Promise<messageDetails[]> {
    return new Promise((resolve, reject) => {
      dbConnection.execute<messageDetails[]>(
        `SELECT
    user_accounts.username,
    user_messages.message,
    user_messages.sender_user_id,
    user_messages.reciever_user_id,
    user_messages.is_read,
    user_messages.created_at,
    user_messages.message_id
  FROM user_accounts, user_messages
  WHERE
  (user_messages.reciever_user_id = ? AND user_messages.sender_user_id = user_accounts.user_id)
  OR
  (user_messages.sender_user_id = ? AND user_messages.reciever_user_id = user_accounts.user_id)
  ORDER BY user_messages.created_at ASC`,
        userId,
        (err, res) => {
          if (err) reject(err);
          resolve(res);
        },
      );
    });
  }
}
