import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import User from '@entities/User';
import { UnauthorizedError } from '@erros/api-erros';
import { JwtPayload } from 'src/@types/jwt.payload';
import jwtConfig from '@config/jwt.config';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;
  if (!authorization) {
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

  const { password: _, ...loggedUser } = user;

  next();
};
