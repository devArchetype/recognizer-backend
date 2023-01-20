import { Request, Response } from 'express';
import UserBuilder from '@builders/UserBuilder';
import ControllerProtocol from '@interfaces/controller.protocol';
import User from '@entities/User';

import * as bcrypt from 'bcrypt';

export default class UserController implements ControllerProtocol {
  private userBuilder = new UserBuilder();

  public async store(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.json({
        error: 'Usuário Já Existe!',
      });

      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    this.userBuilder.reset();
    this.userBuilder.name = name;
    this.userBuilder.email = email;
    this.userBuilder.password = hashedPassword;

    const newUser = this.userBuilder.build();
    const saveUser = await newUser?.save() ?? false;

    if (saveUser) {
      res.status(201).json({
        sucess: 'Usuário cadastrado com sucesso!',
      });
    } else {
      res.json({
        error: 'Oops, Algum erro aconteceu, tente novamente mais tarde!',
      });
    }
  }

  public update(req: Request, res: Response): void {

  }

  public delete(req: Request, res: Response): void {

  }
}
