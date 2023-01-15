import * as express from 'express';
import { Request, Response } from 'express';

// import User from '../app/models/User';

const router = express.Router();

// test route
router.get('/', async (req: Request, res: Response) => {
  res.send('Hello, World');
});

export default router;
