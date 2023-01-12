import { Request, Response, NextFunction } from 'express';

import dotenv from 'dotenv';

import MangaModel from '@/model/manga';
import ChapterModel from '@/model/chapter';

dotenv.config({ path: 'storage.env' });

export default new class {

  // [POST]: '/v1/update/index'
  async index(req: Request, res: Response, next: NextFunction) {
    try {

    } catch (error) {
      next(error);
    }
  }

}