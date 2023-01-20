import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import UserBuilder from '@builders/UserBuilder';
import ControllerProtocol from '@interfaces/controller.protocol';
import User from '@entities/User';
import { BadRequestError } from '@erros/api-erros';
import jwtConfig from '@config/jwt.config';

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

  }

  public async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

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

    res.status(200).json({
      user: loggedUser,
      token,
    });
  }

  async getProfile(req: Request, res: Response) {
    // res.json(req.user);
  }
}
