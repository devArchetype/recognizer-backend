import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import UserBuilder from '@builders/UserBuilder';
import ControllerProtocol from '@interfaces/controller.protocol';
import User from '@entities/User';
import { BadRequestError, UnauthorizedError } from '@erros/api-erros';
import jwtConfig from '@config/jwt.config';
import { JwtPayload } from 'src/@types/jwt.payload';

export default class UserController implements ControllerProtocol {
  private userBuilder = new UserBuilder();

  public async store(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;

    this.userBuilder.reset();
    this.userBuilder.name = name ?? '';
    this.userBuilder.email = email ?? '';
    this.userBuilder.password = password ? await bcrypt.hash(password, 10) : '';

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new BadRequestError('Usuário Já Existe');
    }

    const newUser = this.userBuilder.build();
    const saveUser = await newUser?.save() ?? false;

    if (!saveUser) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    res.status(201).json({
      sucess: 'Usuário cadastrado com sucesso!',
    });
  }

  public async update(req: Request, res: Response): Promise<void> {

  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new UnauthorizedError('Não autorizado');
    }

    const token = authorization?.split(' ')[1] ?? '';
    if (!token) {
      throw new UnauthorizedError('Não autorizado');
    }

    const { id } = jwt.verify(token, jwtConfig.secret) as JwtPayload;
    const deletedUser = await User.destroy({ id });
    if (!deletedUser) {
      throw new UnauthorizedError('Não autorizado');
    }

    res.status(201).json({
      sucess: 'Usuário deletado com sucesso!',
    });
  }

  public async login(req: Request, res: Response): Promise<void> {
    const {
      email, password, keepSession, recaptcha,
    } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('E-mail ou senha inválidos');
    }

    const verifyPass = await bcrypt.compare(password, user.password);
    if (!verifyPass) {
      throw new BadRequestError('E-mail ou senha inválidos');
    }

    const token = jwt.sign({ id: user.id }, jwtConfig.secret, jwtConfig.signOptions);
    const { password: _, ...loggedUser } = user;

    let hashKeepSession: string | null = null;
    if (keepSession) hashKeepSession = await bcrypt.hash(loggedUser.email + password, 10);

    res.status(200).json({
      user: loggedUser,
      token,
      hashKeepSession,
    });
  }
}
