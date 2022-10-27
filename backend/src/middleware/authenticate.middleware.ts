import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { userDetails } from '../queries';

export interface IGetUserAuth extends Request{
  user: userDetails
}

export type authTokenMiddlewareParams = (
  req: IGetUserAuth,
  res: Response,
  next: NextFunction,
) => void;

const authTokenMiddleware: authTokenMiddlewareParams = (req: IGetUserAuth, res, next) => {
  const token = req.cookies.token;
  if (!token || token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_KEY as string, (err: Error, user: userDetails) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export default authTokenMiddleware;
