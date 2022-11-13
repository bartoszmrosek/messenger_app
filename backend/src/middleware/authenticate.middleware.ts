import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { UserDetails } from '../queries';

export interface IGetUserAuth extends Request {
  user: UserDetails;
}

export type authTokenMiddlewareParams = (
  req: IGetUserAuth,
  res: Response,
  next: NextFunction,
) => void;

const authTokenMiddleware: authTokenMiddlewareParams = (
  req: IGetUserAuth,
  res,
  next,
) => {
  const token = req.cookies.token;
  if (!token || token === null) return res.sendStatus(401);
  jwt.verify(
    token,
    process.env.SECRET_KEY as string,
    (err: Error, user: UserDetails) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    },
  );
};

export default authTokenMiddleware;
