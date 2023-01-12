import { Request, Response, NextFunction } from 'express';

import { ErrorType } from '@/utils/plugins';

import MangaModel from '@/model/manga';
import ChapterModel from '@/model/chapter';

export default new class {

  // [POST]: '/v1/restore/manga/:id'
  async manga(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resManga = await MangaModel.findOneAndRestore({ id });
      if (resManga.message === ErrorType.DocumentRestored) {
        res.status(200).json({ message: 'restore successfully.' });
      } else {
        res.status(404).json({ message: 'restore id invalid.' });
      }
    } catch (error) {
      next(error);
    }
  }

  // [POST]: '/v1/restore/chapter/:id'
  async chapter(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resChapter = await ChapterModel.findOneAndRestore({ id });
      if (resChapter.message === ErrorType.DocumentRestored) {
        res.status(200).json({ message: 'restore successfully.' });
      } else {
        res.status(404).json({ message: 'chapter id invalid.' });
      }
    } catch (error) {
      next(error);
    }
  }

}