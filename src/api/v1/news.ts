import { Request, Response, NextFunction } from 'express';
import { Schema } from 'mongoose';
import { Options, File, Fields } from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { storeFile, StorageType } from '@/utils/storeFile';
import CheckPath from '@/utils/checkPath';

import Manga from '@/model/manga';
import Chapter from '@/model/chapter';

dotenv.config({ path: 'storage.env' });

const root: string = process.env.PATH_ROOT || '';
const floderMangas: string = process.env.FD_MANGAS || '';

export interface MangaType {
  name: string,
  desc?: string,
}

interface FileObject {
  [key: string]: File,
}

interface BodyManga {
  name: string,
  desc: string,
  postAt: Schema.Types.Date,
}

interface BodyChapter {
  idManga: string,
  name?: string,
  desc?: string,
  number?: number,
}

export default new class {

  // [POST]: '/v1/new/manga'
  async manga(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, desc, postAt }: BodyManga = req.body;
      if (name) {
        const genId = uuidv4();
        const manga = new Manga({
          name,
          desc,
          id: genId,
          postAt,
        });
        await manga.save();
        res.status(200).json({ 'message': 'created manga.' });
      } else {
        res.status(404).json({ 'message': 'missing field name.' });
      }
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes('E11000 duplicate')) {
        res.status(404).json({ 'message': 'manga is duplicated.' });
      }
      else {
        next(error);
      }
    }
  }

  // [POST]: '/v1/new/chapter'
  async chapter(req: Request, res: Response, next: NextFunction) {
    try {
      const { idManga, desc, name, number }: BodyChapter = req.body;
      if (idManga) {
        const verifyManga = await Manga.findOne({ id: idManga });
        let autoIndex = undefined;
        if (verifyManga) { // manga is exist to continue step
          if(!number) {
            const lastChapterId = verifyManga.chapters.slice(-1)[0];
            if(lastChapterId) {
              const findChapter = await Chapter.findById(lastChapterId);
              if (findChapter) {
                
                autoIndex = findChapter.number as unknown as number + 1;
              }else {
                autoIndex = 0;
              }
            }else {
              autoIndex = 0;
            }
          }else { autoIndex = number; }
          const genId = uuidv4();
          const chapter = new Chapter({
            id: genId,
            idManga: idManga,
            number: autoIndex,
            name,
            desc,
          })
          await chapter.save();
          verifyManga.chapters.push(chapter._id as unknown as Schema.Types.ObjectId);
          await verifyManga.save();
          res.status(200).json({ 'message': 'created chapter.' });
        } else {
          res.status(404).json({ 'message': 'manga is none exist.' });
        }
      } else {
        res.status(404).json({ 'message': 'missing field idManga.' });
      }
    } catch (error) {
      console.log((error as Error).message);
      
      if ((error as Error).message.includes('E11000 duplicate')) {
        res.status(404).json({ 'message': 'chapter is duplicated.' });
      } else {
        next(error);
      }
    }
  }

}