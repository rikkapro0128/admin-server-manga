import { Request, Response, NextFunction } from 'express';
import { Schema } from 'mongoose';
import { Options, File } from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { storeFile, StorageType } from '@/utils/storeFile';
import CheckPath from '@/utils/checkPath';

import Manga from '@/model/manga';

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

export default new class {

  // [POST]: '/v1/new/manga'
  async manga(req: Request, res: Response, next: NextFunction) {
    try {
      const genId = uuidv4();
      const storagePath: string = `${root}/${floderMangas}/${genId}`;
      const pathGenFloderAvatarSave = `${storagePath}/avatar/${uuidv4()}`;
      const pathGenFloderCoverSave = `${storagePath}/cover/${uuidv4()}`;

      const payload = await storeFile(req, storagePath, {
        multiples: true,
        keepExtensions: true,
        maxFiles: 2,
        minFileSize: 10 * 1024,
        maxTotalFileSize: 2 * 1000 * 1024,
        filename(name, ext, part, form) {
          const genFloderId = uuidv4();
          if(part.name === 'avatar') {
            const genName = uuidv4();
            CheckPath.createIfNot(pathGenFloderAvatarSave);
            return `${genName}${ext}`
          }else if(part.name === 'cover') {
            const genName = uuidv4();
            CheckPath.createIfNot(pathGenFloderCoverSave);
            return `${genName}${ext}`
          }else {
            return undefined
          }
        },
      } as Options)
      if(Object.keys(payload.fields).length) {
        if(payload.fields.name) {
          const newManga = new Manga({ name: payload.fields.name, desc: payload.fields.desc, id: genId });
          const filePayload = payload.files as FileObject;
          if(filePayload.avatar) {
            fs.renameSync(filePayload.avatar.filepath, `${pathGenFloderAvatarSave}/${filePayload.avatar.newFilename}`);
            newManga['avatar'] = { ...filePayload.avatar.toJSON(), filepath: `${pathGenFloderAvatarSave}/${filePayload.avatar.newFilename}`.split(`${root}/${floderMangas}/`)[1] } as unknown as Schema.Types.Mixed
          }
          if(filePayload.cover) {
            fs.renameSync(filePayload.avatar.filepath, `${pathGenFloderCoverSave}/${filePayload.cover.newFilename}`);
            newManga['cover'] = { ...filePayload.cover.toJSON(), filepath: `${pathGenFloderAvatarSave}/${filePayload.cover.newFilename}`.split(`${root}/${floderMangas}/`)[1] } as unknown as Schema.Types.Mixed
          }
          await newManga.save();
          res.status(200).json({ message: 'created manga.' })
        }else {
          fs.rmSync(storagePath, { force: true, recursive: true });
          res.status(404).json({ message: 'missing field require.' })
        }
      }else {
        fs.rmSync(storagePath, { force: true, recursive: true });
        res.status(404).json({ message: 'missing fields require.' })
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