import { Request, Response } from 'express';
import UserBuilder from '@builders/UserBuilder';
import ControllerProtocol from '@interfaces/controller.protocol';
import User from '@entities/User';

import * as bcrypt from 'bcrypt';

export default class UserController implements ControllerProtocol {
  private userBuilder = new UserBuilder();

  public index(req: Request, res: Response): void {

  }

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
    await newUser.save();

    const { password: _, ...user } = newUser;

    res.status(201).json(user);
  }

  public update(req: Request, res: Response): void {

  }

  public delete(req: Request, res: Response): void {

  }
}
