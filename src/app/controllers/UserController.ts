import { Request, Response } from 'express';
import UserBuilder from '../builders/UserBuilder';
import ControllerProtocol from '../interfaces/controller.protocol';

export default class UserController implements ControllerProtocol {
  constructor(
    private userBuilder = new UserBuilder(),
  ) {}

  public index(req: Request, res: Response): string {
    return 'json';
  }

  public store(req: Request, res: Response): string {
    return 'json';
  }

  public update(req: Request, res: Response): string {
    return 'json';
  }

  public delete(req: Request, res: Response): string {
    return 'json';
  }
}
