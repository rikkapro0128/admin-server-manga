import { Request, Response, NextFunction } from 'express';
import { Schema } from 'mongoose';
import formidable, { Options, Fields, Files, File } from 'formidable';

import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

import CheckPath from '@/utils/checkPath';
import MangaModel from '@/model/manga';

dotenv.config({ path: 'storage.env' });

const root: string = process.env.PATH_ROOT || '';
const floderMangas: string = process.env.FD_MANGAS || '';

export enum ProfileList {
  avatar = 'avatar',
  cover = 'cover',
}

export interface StorageType {
  fields: Fields;
  files: Files;
}

export function storeFile(req: Request, path: string, options: Options): Promise<StorageType> {
  return new Promise((res, rej) => {
    if (!fs.existsSync(path)) { fs.mkdirSync(path, { recursive: true }) }
    const form = formidable({
      uploadDir: path,
      filter: function ({ name, originalFilename, mimetype }) {
        // keep only images
        return !!(mimetype && mimetype.includes("image"));
      },
      filename(name, ext, part, form) {
        // modifer name file to save
        const genId: string = uuidv4();
        return `${genId}${ext}`;
      },
      ...options,
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        rej(err);
      }
      res({ fields, files });
    });
  })
}

export async function coreUpdateProfileManga(req: Request, res: Response, next: NextFunction, type: ProfileList, option: Options) {
  const { mangaId } = req.params;
  if (mangaId) {

    const checkMangaId = await MangaModel.findOne({ id: mangaId });
    if (checkMangaId) {
      const coverGenId: string = uuidv4();
      const storagePath: string = `${root}/${floderMangas}/${mangaId}/${type}/${coverGenId}`;

      try {
        CheckPath.createIfNot(storagePath);
      } catch (error) {
        return res.status(404).json({ 'message': `can\'t storage this ${type} of manga.` });
      }

      const info = await storeFile(req, storagePath, option) as StorageType;
      // handle save info this cover
      const filePayload = info.files.file as File;
      if (filePayload) {
        checkMangaId[type] = { ...filePayload.toJSON(), filepath: filePayload.filepath.split(`mangas\\`)[1] } as unknown as Schema.Types.Mixed;
        await checkMangaId.save();
        res.status(200).json(checkMangaId.avatar);
      } else {
        fs.rmSync(storagePath, { force: true, recursive: true });
        res.status(404).json({ 'message': 'form include key invalid.' });
      }
    } else {
      res.status(404).json({ 'message': 'manga id invalid.' });
    }
  } else {
    res.status(404).json({ 'message': 'missing field require.' });
  }
}
