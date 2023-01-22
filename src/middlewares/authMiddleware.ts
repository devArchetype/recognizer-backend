import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import User from '@entities/User';
import { UnauthorizedError } from '@erros/api-erros';
import { JwtPayload } from 'src/@types/jwt.payload';
import jwtConfig from '@config/jwt.config';

import * as bcrypt from 'bcrypt';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization, hashKeepSession } = req.headers;
  if (!authorization && !hashKeepSession) {
    throw new UnauthorizedError('Não autorizado');
  }

  const token = authorization?.split(' ')[1] ?? '';
  if (!token) {
    throw new UnauthorizedError('Não autorizado');
  }

  const { id } = jwt.verify(token, jwtConfig.secret) as JwtPayload;
  const user = await User.findOne({ id });
  if (!user) {
    throw new UnauthorizedError('Não autorizado');
  }

  if (hashKeepSession) {
    const verifyhash = await bcrypt.compare(String(hashKeepSession), user.email + user.password);
    if (!verifyhash) {
      throw new UnauthorizedError('Não autorizado');
    }
  }

  const { password: _, ...loggedUser } = user;
  req.user = loggedUser;

  next();
};
