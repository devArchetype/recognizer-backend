import { Request, Response } from 'express';
import UserBuilder from '../builders/UserBuilder';
import ControllerProtocol from '../interfaces/controller.protocol';

export default class UserController implements ControllerProtocol {
  private userBuilder = new UserBuilder();

  public index(req: Request, res: Response): void {

  }

  public async store(req: Request, res: Response): Promise<void> {
    this.userBuilder.name = 'riquelmeD';
    this.userBuilder.email = 'riquelme1322dewdwe3@gmail.com';
    this.userBuilder.password = '1234';

    const user = this.userBuilder.build();
    let response = '';
    if (await user.save()) {
      response = JSON.stringify(user);
    } else {
      response = JSON.stringify({ erros: ['Conta já cadastrada!'] });
    }

    res.send(response);
  }

  public update(req: Request, res: Response): void {

  }

  public delete(req: Request, res: Response): void {

  }
}
