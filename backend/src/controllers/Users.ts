import { Request, Response } from 'express';
import { MysqlDb, UserDetails, UserInfoWithPacket } from '../queries';
import checkUserLoginData from '../utils/checkUserLoginData';
import checkOrCreateUser from '../utils/checkOrCreateUser';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import searchUserUtil from '../utils/searchUserUtil';
import getLastestConnections from '../utils/getUserLatestConnections';
import { IGetUserAuth } from '../middleware/authenticate.middleware';

//This is purely to satisfy typescript errors when using with expressJs cookies
type CreateNewCookieType = (bodyCheckResults: UserInfoWithPacket) => {
  content: string;
  options: {
    httpOnly: boolean;
    expires: Date;
    sameSite: 'none';
    secure: boolean;
  };
};

const createNewCookie: CreateNewCookieType = (
  bodyCheckResults: UserInfoWithPacket,
) => {
  const newToken = jwt.sign(
    bodyCheckResults,
    process.env.SECRET_KEY as string,
    { expiresIn: process.env.EXPIRE_TIMEOUT as string },
  );

  const date = new Date();
  const now = date.getTime();
  const expire = now + ms(process.env.EXPIRE_TIMEOUT as string);

  date.setTime(expire);
  return {
    content: newToken,
    options: { httpOnly: true, expires: date, sameSite: 'none', secure: true },
  };
};

export class Users {
  registerUser = async (req: Request, res: Response) => {
    if (
      typeof req.body.username === 'string' &&
      typeof req.body.email === 'string' &&
      typeof req.body.password === 'string'
    ) {
      const data: UserDetails = req.body;
      const resCode = await checkOrCreateUser(data);
      return res.sendStatus(resCode);
    }
    return res.sendStatus(400);
  };

  loginUser = async (req: Request, res: Response) => {
    const bodyCheck = async () => {
      if (
        typeof req.body.email === 'string' &&
        typeof req.body.password === 'string'
      ) {
        return await checkUserLoginData(req.body);
      }
      return 400;
    };

    const bodyCheckResults = await bodyCheck();
    if (typeof bodyCheckResults === 'object') {
      const cookie = createNewCookie(bodyCheckResults.results);
      res.cookie('token', cookie.content, cookie.options);
      return res.send(bodyCheckResults.results);
    }

    const token: unknown = req.cookies.token;
    if (typeof token === 'string') {
      try {
        return jwt.verify(
          token,
          process.env.SECRET_KEY as string,
          (err: Error, user: UserDetails) => {
            if (err) {
              res.cookie('token', 'rubbish', { maxAge: 0 });
              throw 401;
            } else {
              return res.send(user);
            }
          },
        );
      } catch (err) {
        res.sendStatus(err);
      }
    }
    return res.sendStatus(bodyCheckResults);
  };

  searchUser = async (req: Request, res: Response) => {
    if (typeof req.query.username === 'string') {
      const queryRes = await searchUserUtil(req.query.username);
      if (queryRes === 500) return res.sendStatus(500);
      return res.send(queryRes);
    }
    return res.sendStatus(400);
  };

  getUserHistory = async (req: IGetUserAuth, res: Response) => {
    const dbQueryRes = await getLastestConnections(req.user.user_id);
    if (typeof dbQueryRes === 'number') return res.sendStatus(dbQueryRes);
    return res.send(dbQueryRes);
  };

  getUserChatHistory = async (
    req: IGetUserAuth,
    res: Response,
    DbConnection: MysqlDb,
  ) => {
    if (
      typeof req.query.selectedChat === 'string' &&
      req.query.selectedChat !== 'undefined'
    ) {
      const selectedChat = parseInt(req.query.selectedChat);
      return res.send(
        await DbConnection.getChatHistory(req.user.user_id, selectedChat),
      );
    }
    return res.sendStatus(400);
  };
}
