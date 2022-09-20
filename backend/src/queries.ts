import { dbConnection } from './dbHandler';

export interface newUser {
  username: string;
}

export class dbQueries {
  insertNewUser<userType>(user: userType): Promise<userType> {}
}
