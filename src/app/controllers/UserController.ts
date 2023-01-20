import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import UserBuilder from '@builders/UserBuilder';
import ControllerProtocol from '@interfaces/controller.protocol';
import User from '@entities/User';
import { BadRequestError } from '@erros/api-erros';

export default class UserController implements ControllerProtocol {
  private userBuilder = new UserBuilder();

  public async store(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new BadRequestError('Usuário Já Existe');
    }

    this.userBuilder.reset();
    this.userBuilder.name = name;
    this.userBuilder.email = email;
    this.userBuilder.password = await bcrypt.hash(password, 10);

    const newUser = this.userBuilder.build();
    const saveUser = await newUser?.save() ?? false;

    if (!saveUser) {
      throw new BadRequestError('Oops, Algo de errado aconteceu, tente novamente mais tarde!');
    }

    res.status(201).json({
      sucess: 'Usuário cadastrado com sucesso!',
    });
  }

  public update(req: Request, res: Response): void {

  }

  public delete(req: Request, res: Response): void {

  }
}
