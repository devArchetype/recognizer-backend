import { Request, Response } from 'express';

export default interface ControllerProtocol {
  store(req: Request, res: Response): void;
  update(req: Request, res: Response): void;
  delete(req: Request, res: Response): void;
}
