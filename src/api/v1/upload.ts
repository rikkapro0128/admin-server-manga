import { Request, Response, NextFunction } from 'express';
import formidable from 'formidable';
import dotenv from 'dotenv';

dotenv.config({ path: 'storage.env' });

const drive: string = process.env.DRIVE || '';
const pathFloderImage: string = process.env.PATH_FD_IMAGE || '';

const fieldGetImage: string = 'images';

export default new class {

  chapter(req: Request, res: Response, next: NextFunction) {
    
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      uploadDir: `${drive}:/${pathFloderImage}`,
      filter: function ({ name, originalFilename, mimetype }) {
        // keep only images
        return !!(mimetype && mimetype.includes("image"));
      },
      filename(name, ext, part, form) {
        return `${name}.${ext}`;
      },
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      res.json({ fields, files });
    });

  }

}
