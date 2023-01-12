import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

import MangaModel from '@/model/manga';
import ChapterModel from '@/model/chapter';

dotenv.config({ path: 'storage.env' });

export default new class {

  // [GET]: 'v1/get/manga/:id'
  async manga(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const manga = await MangaModel.findOne({ id }).select('-chapters -_id -__v');
      if (manga) {
        res.status(200).json(manga);
      } else {
        res.status(404).json({ message: 'manga id invalid.' });
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET]: 'v1/get/manga-profile/:id'
  async mangaProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const manga = await MangaModel.findOne({ id }).populate([{ path: 'chapters', select: '-images -__v -_id' }]).select('-_id -__v');
      if (manga) {

        res.status(200).json(manga);
      } else {
        res.status(404).json({ message: 'manga id invalid.' });
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET]: 'v1/get/chapter/:id'
  async chapter(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const chapter = await ChapterModel.findOne({ id }).select('-images -_id -__v');
      if (chapter) {
        res.status(200).json(chapter);
      } else {
        res.status(404).json({ message: 'chapter id invalid.' });
      }
    } catch (error) {
      next(error);
    }
  }
  // [GET]: 'v1/get/chapter/:id/images'
  async chapterImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const chapter = await ChapterModel.findOne({ id }).select('-_id -images.newFilename -images.originalFilename -__v');
      if (chapter) {
        res.status(200).json(chapter);
      } else {
        res.status(404).json({ message: 'chapter id invalid.' });
      }
    } catch (error) {
      next(error);
    }
  }

}
