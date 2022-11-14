import mysql, { OkPacket, RowDataPacket } from 'mysql2';
import 'dotenv/config';
import { MessageStatus } from './interfaces/MessageInterfaces';
export interface UserDetails {
  username: string;
  password?: string;
  email?: string;
  user_id?: number;
}
export interface UserInfoWithPacket extends RowDataPacket {
  username: string;
  password?: string;
  email?: string;
  user_id?: number;
}

export interface UserLoginDetails {
  email: string;
  password: string;
}

export interface MessageDetails extends RowDataPacket {
  username: string;
  message: string;
  sender_user_id: number;
  reciever_user_id: number;
  status: MessageStatus;
  created_at: string;
  message_id: number;
}

export interface NewMessage {
  message: string;
  sender_user_id: number;
  reciever_user_id: number;
  status: MessageStatus;
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
      connection.query('SET sql_mode =""');
      return await action(connection);
    } finally {
      connection.release();
    }
  }

  insertNewUser(
    newUserData: UserDetails,
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
    userLoginData: UserLoginDetails,
  ): Promise<UserInfoWithPacket | number> {
    return this.#usePooledConnection<UserInfoWithPacket | number>(
      async connection => {
        return new Promise((resolve, reject) => {
          connection.execute<UserInfoWithPacket[]>(
            `SELECT user_id, username, email 
            FROM user_accounts 
            WHERE email = ? AND password = ?`,
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
  searchUser(username: string): Promise<UserDetails[] | number> {
    return this.#usePooledConnection(async connection => {
      return new Promise((resolve, reject) => {
        connection.execute<UserInfoWithPacket[]>(
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
  getUserLatestConnections(userId: number): Promise<MessageDetails[] | number> {
    return this.#usePooledConnection(async connection => {
      return new Promise((resolve, reject) => {
        connection.execute<MessageDetails[]>(
          `
          SELECT
        user_accounts.username,
        user_messages.message,
        user_messages.sender_user_id,
        user_messages.reciever_user_id,
        user_messages.status,
        user_messages.created_at,
        user_messages.message_id
        FROM user_accounts, user_messages
        WHERE
        (user_messages.reciever_user_id = ? AND user_messages.sender_user_id = user_accounts.user_id)
        OR
        (user_messages.sender_user_id = ? AND user_messages.reciever_user_id = user_accounts.user_id)
        GROUP BY user_accounts.username 
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
  getChatHistory(
    firstUserId: number,
    secondUserId: number,
  ): Promise<MessageDetails[] | mysql.QueryError> {
    return this.#usePooledConnection(async connection => {
      return new Promise((resolve, reject) => {
        connection.execute<MessageDetails[]>(
          `SELECT message, sender_user_id, reciever_user_id, status, created_at, message_id 
          FROM user_messages 
          WHERE (sender_user_id = ? AND reciever_user_id = ?) OR (reciever_user_id = ? AND sender_user_id = ?)
          ORDER BY user_messages.created_at ASC;`,
          [firstUserId, secondUserId, firstUserId, secondUserId],
          (err, res) => {
            if (err) {
              console.log(err);
              reject(500);
            }
            resolve(res);
          },
        );
      });
    });
  }
  saveNewMessage(message: NewMessage): Promise<null | 500> {
    return this.#usePooledConnection(async connection => {
      return new Promise((resolve, reject) => {
        connection.execute<OkPacket>(
          `
    INSERT INTO user_messages (sender_user_id, reciever_user_id, message, status)
    VALUES ( ?, ?, ?, ? );`,
          [
            message.sender_user_id,
            message.reciever_user_id,
            message.message,
            message.status,
          ],
          err => {
            if (err) {
              console.log(err);
              reject(500);
            }
            resolve(null);
          },
        );
      });
    });
  }
}
