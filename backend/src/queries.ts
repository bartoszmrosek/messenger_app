import mysql, { OkPacket, RowDataPacket } from 'mysql2';

export interface newUser {
  username: string;
  password: string;
  email: string;
}

export interface UserDetails extends RowDataPacket {
  user_id: number;
  username: string;
  email: string;
}

export interface userLoginDetails {
  email: string;
  security_key: number | string;
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

  insertNewUser(newUserData: newUser): Promise<number | null> {
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
  loginUser(userLoginData: userLoginDetails): Promise<UserDetails | number> {
    return new Promise((resolve, reject) => {
      dbConnection.execute<UserDetails[]>(
        this.#checkUser(typeof userLoginData.security_key === 'number'),
        [userLoginData.email, userLoginData.security_key],
        (err, res) => {
          if (err) reject(err);
          if (!res[0]) reject(3);
          resolve(res[0]);
        },
      );
    });
  }
}
