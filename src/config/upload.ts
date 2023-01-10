import { Options } from 'formidable';

export const chapter: Options = {
  multiples: true,
  keepExtensions: true,
  maxFiles: 100,
  minFileSize: 10 * 1024,
  maxTotalFileSize: 100 * 500 * 1024,
}

export const avatar: Options = {
  multiples: false,
  keepExtensions: true,
  minFileSize: 10 * 1024,
  maxTotalFileSize: 500 * 1024,
}

export const cover: Options = {
  multiples: false,
  keepExtensions: true,
  minFileSize: 10 * 1024,
  maxTotalFileSize: 1200 * 1024,
}
