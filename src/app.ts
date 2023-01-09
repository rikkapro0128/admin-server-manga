import express, { Application, Request, Response } from 'express';
import { onListen } from './utils/listen';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import checkPath from './utils/checkPath';
import routes from './router/index';

dotenv.config({ path: 'storage.env' });
const app: Application = express();
const port: number = 3000;
const drive: string = process.env.DRIVE || '';
const pathFloderImage: string = process.env.PATH_FD_IMAGE || '';
const pathFloderAvatar: string = process.env.PATH_FD_AVATAR || '';

checkPath.storage(drive, pathFloderImage);
checkPath.storage(drive, pathFloderAvatar);

// parse json request body
app.use(morgan(':method :url :status :remote-addr - :response-time ms'));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());

// v1 api routes
app.use('/v1', routes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send(`Server API`);
});

app.listen(port, () => onListen(port));
