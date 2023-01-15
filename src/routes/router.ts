import * as express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// test route
router.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

export default router;
