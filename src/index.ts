import * as express from 'express';
import { Request, Response } from 'express';

import User from '@models/User';

new User().log();
const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.listen(3000, () => console.log('listening on port 3000'));
