import mysql, { OkPacket, RowDataPacket } from 'mysql2';
import 'dotenv/config';
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
  password: number | string;
}

export interface messageDetails extends RowDataPacket {
  username: string;
  message: string;
  sender_user_id: number;
  reciever_user_id: number;
  is_read: boolean;
  created_at: string;
  message_id: number;
}

export interface newMessage {
  user_id: number;
  username: string;
  message: string;
  sender_user_id: number;
  reciever_user_id: number;
  is_read: boolean;
  created_at: string;
}

const dbConnection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  ssl: {
    rejectUnauthorized: true,
  },
  connectTimeout: 10000,
});

export class DbQueries {
  async #usePooledConnection<Type>(
    action: (callback: mysql.PoolConnection) => Promise<Type>,
  ) {
    const connection = await new Promise<mysql.PoolConnection>(
      (resolve, reject) => {
        dbConnection.getConnection((err, conn) => {
          if (err) {
            reject(err);
          } else {
            resolve(conn);
          }
        });
      },
    );
    try {
      return await action(connection);
    } finally {
      connection.release();
    }
  }

  #checkUser = (shouldUseUserId: boolean) => {
    if (shouldUseUserId) {
      return `SELECT user_id, username, email FROM user_accounts WHERE email = ? AND user_id = ?`;
    } else {
      return `SELECT user_id, username, email FROM user_accounts WHERE email = ? AND password = ?`;
    }
  };

  insertNewUser(
    newUserData: userDetails,
  ): Promise<mysql.QueryError | null | number> {
    return this.#usePooledConnection<mysql.QueryError | null>(
      async connection => {
        return new Promise((resolve, reject) => {
          connection.query<OkPacket>(
            'INSERT INTO user_accounts(username, email, password) VALUES(?, ?, ?)',
            [newUserData.username, newUserData.email, newUserData.password],
            err => {
              if (err !== null && err.errno === 1062) reject(1);
              if (err) reject(err);
              resolve(null);
            },
          );
        });
      },
    );
  }
  loginUser(
    userLoginData: userLoginDetails,
  ): Promise<userInfoWithPacket | number> {
    return this.#usePooledConnection<userInfoWithPacket | number>(
      async connection => {
        return new Promise((resolve, reject) => {
          connection.execute<userInfoWithPacket[]>(
            this.#checkUser(typeof userLoginData.password === 'number'),
            [userLoginData.email, userLoginData.password],
            (err, res) => {
              if (err) reject(err);
              if (!res[0]) reject(3);
              resolve(res[0]);
            },
          );
        });
      },
    );
  }
  searchUser(username: string): Promise<userDetails[] | number> {
    return this.#usePooledConnection(async connection => {
      return new Promise((resolve, reject) => {
        connection.execute<userInfoWithPacket[]>(
          'SELECT user_id, username FROM user_accounts WHERE username LIKE ?',
          [`${username}%`],
          (err, res) => {
            if (err) reject(err);
            resolve(res);
          },
        );
      });
    });
  }
  searchUserMessagesHistory(
    userId: number,
  ): Promise<messageDetails[] | number> {
    return this.#usePooledConnection(async connection => {
      return new Promise((resolve, reject) => {
        connection.execute<messageDetails[]>(
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
          [userId, userId],
          (err, res) => {
            if (err) reject(err);
            resolve(res);
          },
        );
      });
    });
  }
  saveNewMessage(message: newMessage): Promise<null | number> {
    return this.#usePooledConnection(async connection => {
      return new Promise((resolve, reject) => {
        connection.execute<OkPacket>(
          `
    INSERT INTO user_messages (sender_user_id, reciever_user_id, message, is_read)
    VALUES ( ?, ?, ?, ? );`,
          [
            message.sender_user_id,
            message.reciever_user_id,
            message.message,
            message.is_read,
          ],
          err => {
            if (err) reject(err);
            resolve(null);
          },
        );
      });
    });
  }
}
