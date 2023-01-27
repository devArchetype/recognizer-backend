import { UserDTO } from '@entities/User';

declare global {
  namespace Express {
    export interface Request {
      user?: Partial<User>,
      token?: Partial<string>
    }
  }
}
