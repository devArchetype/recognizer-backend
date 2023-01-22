import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import User from '@entities/User';
import { UnauthorizedError } from '@erros/api-erros';
import { JwtPayload } from 'src/@types/jwt.payload';
import jwtConfig from '@config/jwt.config';
import { decode } from 'punycode';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;
  console.log(req.headers);
  if (!authorization) {
    throw new UnauthorizedError('Não autorizado 1');
  }

  const token = authorization?.split(' ')[1] ?? '';
  if (!token) {
    throw new UnauthorizedError('Não autorizado 2');
  }

  const { id } = jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      throw new UnauthorizedError('Não autorizado 3');
    } else {
      return decode;
    }
  }) as unknown as JwtPayload;

  const user = await User.findOne({ id });

  if (!user) {
    throw new UnauthorizedError('Não autorizado 4');
  }

  const { password: _, ...loggedUser } = user;
  req.user = loggedUser;

  next();
};
