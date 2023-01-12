import { Request, Response, NextFunction } from 'express';

import { ErrorType } from '@/utils/plugins';

import MangaModel from '@/model/manga';
import ChapterModel from '@/model/chapter';

export default new class {

  // [DELETE]: 'v1/remove/manga/:id'
  async manga(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resManga = await MangaModel.findOneAndSoftDelete({ id });
      if (resManga.message === ErrorType.DocumentDeleted) {
        res.status(200).json({ message: 'remove successfully.' });
      } else {
        res.status(404).json({ message: 'manga id invalid.' });
      }
    } catch (error) {
      next(error);
    }
  }

  // [DELETE]: 'v1/remove/chapter/:id'
  async chapter(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const chapter = await ChapterModel.findOneAndSoftDelete({ id });
      if (chapter.message === ErrorType.DocumentDeleted) {
        res.status(200).json(chapter);
      } else {
        res.status(404).json({ message: 'chapter id invalid.' });
      }
    } catch (error) {
      next(error);
    }
  }

}
