import { Request, Response } from 'express';
import { UserDetails, UserInfoWithPacket } from '../queries';
import checkUserLoginData from '../utils/checkUserLoginData';
import checkOrCreateUser from '../utils/checkOrCreateUser';
import jwt from 'jsonwebtoken';
import ms from 'ms';

function createNewCookie(bodyCheckResults: UserInfoWithPacket) {
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
}

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
      res.cookie(cookie.content, cookie.options);
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
}
