import * as express from 'express';
import router from './routes/router';

const app = express();

app.use(router);

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
