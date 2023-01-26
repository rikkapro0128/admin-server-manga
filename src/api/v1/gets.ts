import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

import MangaModel from '@/model/manga';
import ChapterModel from '@/model/chapter';

import { mangas as MangaOptions, SortType } from '@/config/getOptions';
import { Schema } from 'mongoose';

dotenv.config({ path: 'storage.env' });

interface MangasRequestOptions {
  limit?: string,
  skip?: string,
  sort?: SortType,
}

export default new class {

  // [GET]: 'v1/get/mangas-test?skip={number}&index={number}&sort={asc|desc}'
  async mangasTest(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, skip: index, sort }: MangasRequestOptions = req.query;
      const optionsTemp = {
        limit: limit && parseInt(limit) >= 0 ? parseInt(limit) : MangaOptions.limit,
        index: index && parseInt(index) > 0 ? parseInt(index) : MangaOptions.index,
        sort: sort ? sort : MangaOptions.sort,
      }
      const countTotalManga = await MangaModel.count({ deleted: false });
      const mangas = await MangaModel.aggregate([{ $addFields: { getIdPresent: { $last: '$chapters' } } }, { $lookup: { as: 'docChapter', from: 'chapters', localField: 'getIdPresent', foreignField: '_id' } }, { $set: { chapterPresent: { $arrayElemAt: ['$docChapter.number', 0] } } }, { $project: { "_id": 0, "deleted": 0, "__v": 0, "chapters": 0, "getIdPresent": 0, "docChapter": 0 } }]).limit(optionsTemp.limit).skip(optionsTemp.index - 1).sort({ 'updatedAt': optionsTemp.sort });
      res.status(200).json({ payload: mangas, count: countTotalManga });
    } catch (error) {
      next(error);
    }
  }

  // [GET]: 'v1/get/mangas?skip={number}&index={number}&sort={asc|desc}'
  async mangas(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, skip: index, sort }: MangasRequestOptions = req.query;
      const optionsTemp = {
        limit: limit && parseInt(limit) >= 0 ? parseInt(limit) : MangaOptions.limit,
        index: index && parseInt(index) > 0 ? parseInt(index) : MangaOptions.index,
        sort: sort ? sort : MangaOptions.sort,
      }
      const countTotalManga = await MangaModel.count({ deleted: false });
      const mangas = await MangaModel.aggregate([{ $addFields: { getIdPresent: { $last: '$chapters' } } }, { $lookup: { as: 'docChapter', from: 'chapters', localField: 'getIdPresent', foreignField: '_id' } }, { $set: { chapterPresent: { $arrayElemAt: ['$docChapter.number', 0] } } }, { $project: { "_id": 0, "deleted": 0, "__v": 0, "chapters": 0, "getIdPresent": 0, "docChapter": 0 } }]).limit(optionsTemp.limit).skip(optionsTemp.index - 1).sort({ 'updatedAt': optionsTemp.sort });
      res.status(200).json({ payload: mangas, count: countTotalManga });
    } catch (error) {
      next(error);
    }
  }

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

  // [GET]: 'v1/get/manga/:id/num-chapter-present'
  async getChapterPresentByManga(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (id) {
        const verifyManga = await MangaModel.findOne({ id });
        if (verifyManga) {
          let present = 0;
          if (verifyManga.chapters.length > 0) {
            const idLast = verifyManga.chapters.slice(-1)[0];
            const verifyChapter = await ChapterModel.findById(idLast);
            if (verifyChapter?.number) { (present as unknown as Schema.Types.Number) = verifyChapter.number };
          }
          res.status(200).json({ present });
        } else {
          res.status(404).json({ message: 'manga not found.' });
        }
      } else {
        res.status(404).json({ message: 'missing id length.' });
      }
    } catch (error) {
      next(error);
    }
  }

}
