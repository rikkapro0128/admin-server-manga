import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import initConnectToMongo from '@/database/index';
import { onListen } from '@/utils/listen';
import checkPath from '@/utils/checkPath';
import routes from '@/router/index';

dotenv.config({ path: 'storage.env' });
const app: Application = express();
const port: number = 3000;
const pathRoot: string = process.env.PATH_ROOT || '';
const floderMangas: string = process.env.FD_MANGAS || '';
const floderAvatar: string = process.env.FD_AVATAR || '';
const floderCover: string = process.env.FD_COVER || '';

checkPath.storage(pathRoot, floderMangas);
checkPath.storage(pathRoot, floderAvatar);
checkPath.storage(pathRoot, floderCover);

// register static file
app.use('/files', express.static(pathRoot));

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

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const message = err.message;
  console.error(message)
  if (message.includes('validation failed')) {
    res.status(404).json({ 'message': 'data type of field wrong.' });
  }else {
    res.status(404).json({ message: 'something went wrong.' })
  }
})

app.get('/', (req: Request, res: Response) => {
  res.status(200).send(`Server API`);
});

// parse json request body
initConnectToMongo()
.then(() => {
  app.listen(port, () => onListen(port));
})

