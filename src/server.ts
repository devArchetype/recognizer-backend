import 'dotenv/config';
import * as express from 'express';
import * as cors from 'cors';
import corsOptions from '@config/cors.options';
import router from '@routes/router';

const app = express();

app.use(cors(corsOptions));

app.use(express.json());
app.use(router);

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
