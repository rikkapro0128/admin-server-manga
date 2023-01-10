import { Request, Response, NextFunction } from 'express';
import formidable from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

import Manga from '@/model/manga';

dotenv.config({ path: 'storage.env' });

export interface MangaType {
  name: string,
  desc?: string,
}

export default new class {

  // [POST]: '/v1/new/manga'
  async manga(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, desc }: MangaType = req.body;
      if(name && desc) {
        const newManga = new Manga({ name, desc, id: uuidv4() });
        await newManga.save();
        res.status(200).json({ message: 'created manga.' })
      }else {
        res.status(404).json({ message: 'missing field require.' })
      }
    } catch (error) {
      if((error as Error).message.includes('E11000 duplicate')) {
        res.status(404).json({ 'message': 'manga is duplicated.' });
      }else {
        next(error);
      }
    }
  }

}