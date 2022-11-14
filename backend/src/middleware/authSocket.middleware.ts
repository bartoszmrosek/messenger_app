import { SocketWithUserAuth } from '../app';
import { parse } from 'cookie';
import { UserDetails } from '../queries';
import { ExtendedError } from 'socket.io/dist/namespace';
import jwt from 'jsonwebtoken';

const authSocketMiddleware = (
  socket: SocketWithUserAuth,
  next: (err?: ExtendedError) => void,
) => {
  try {
    const cookies = parse(socket.handshake.headers.cookie);
    if (!cookies.token) {
      const err = new Error();
      err.cause = 403;
      throw err;
    }
    jwt.verify(
      cookies.token,
      process.env.SECRET_KEY as string,
      async (err: Error, user: UserDetails) => {
        if (err) throw err;
        socket.user = user;
        next();
      },
    );
  } catch (error) {
    next(error);
  }
};

export default authSocketMiddleware;
