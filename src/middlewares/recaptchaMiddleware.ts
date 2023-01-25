import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { UnauthorizedError } from '@erros/api-erros';

export const recaptchaMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { recaptcha } = req.body;

  if (!recaptcha) {
    throw new UnauthorizedError('Não autorizado');
  }

  const { status } = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.ReCAPTCHA_KEY}&response=${recaptcha}`,
  );

  if (!status || status !== 200) {
    throw new UnauthorizedError('Não autorizado');
  }

  next();
};
