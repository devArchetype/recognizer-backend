import { Request, Response } from 'express';

export default interface ControllerProtocol {
  index(req: Request, res: Response): string;
  store(req: Request, res: Response): string;
  update(req: Request, res: Response): string;
  delete(req: Request, res: Response): string;
}
