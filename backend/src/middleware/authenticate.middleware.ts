import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export type authTokenMiddlewareParams = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

const authTokenMiddleware: authTokenMiddlewareParams = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SECRES as string, (err: Error) => {
    if (err) return res.sendStatus(403);
    next();
  });
};

export default authTokenMiddleware;
