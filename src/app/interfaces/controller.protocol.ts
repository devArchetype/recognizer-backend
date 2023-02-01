import { Request, Response } from 'express';

export default interface ControllerProtocol {
  store(req: Request, res: Response): void;
}
