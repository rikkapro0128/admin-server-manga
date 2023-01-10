import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { Options, Fields, Files, File } from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

import MangaModel from '@/model/manga';
import ChapterModel from '@/model/chapter';

import { chapter, avatar, cover } from '@/config/upload';
import { storeFile, coreUpdateProfileManga, StorageType, ProfileList } from '@/utils/storeFile';
import CheckPath from '@/utils/checkPath';

dotenv.config({ path: 'storage.env' });

const root: string = process.env.PATH_ROOT || '';
const floderMangas: string = process.env.FD_MANGAS || '';

export default new class {

  // [POST]: '/v1/upload/chapter'
  async chapter(req: Request, res: Response, next: NextFunction) {

    const { mangaId, numberChapter } = req.query;

    if (mangaId && numberChapter) {
      const checkMangaId = await MangaModel.findOne({ id: mangaId });
      if (checkMangaId) {
        const chapterGenId: string = uuidv4();
        const storagePath: string = `${root}/${floderMangas}/${mangaId}/chapters/${chapterGenId}`;

        try {
          CheckPath.createIfNot(storagePath);
        } catch (error) {
          return res.status(404).json({ 'message': 'can\'t storage this chapter.' });
        }

        try {
          const info = await storeFile(req, storagePath, chapter) as StorageType;
          // handle save info this chater
          const newChapter = new ChapterModel({
            id: uuidv4(),
            desc: info.fields.desc || '',
            idManga: mangaId,
            number: numberChapter,
            images: (info.files.files as File[]).map(file => ({ ...file.toJSON(), filepath: file.filepath.split(`${floderMangas}\\`)[1] })),
          })
          await newChapter.save();
          checkMangaId.chapters.push(newChapter.id);
          await checkMangaId.save();
          res.status(200).json(newChapter.images);
        } catch (error) {
          if ((error as Error).message.includes('E11000 duplicate')) {
            res.status(404).json({ 'message': 'chapter is duplicated.' });
          } else {
            next(error);
          }

        }
      } else {
        res.status(404).json({ 'message': 'manga id invalid.' });
      }
    } else {
      res.status(404).json({ 'message': 'missing field require.' });
    }

  }

  // [POST]: '/v1/upload/avatar/manga'
  async avatar(req: Request, res: Response, next: NextFunction) {
    try {
      await coreUpdateProfileManga(req, res, next, ProfileList.avatar, avatar);
    } catch (error) {
      next(error);
    }
  }

  // [POST]: '/v1/upload/cover/manga'
  async cover(req: Request, res: Response, next: NextFunction) {
    try {
      await coreUpdateProfileManga(req, res, next, ProfileList.cover, cover);
    } catch (error) {
      next(error);
    }
  }

}
