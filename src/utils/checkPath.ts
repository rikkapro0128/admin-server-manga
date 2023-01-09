import fs from 'fs';

export default new class CheckPath {

  storage(drive: string, pathStore: string) {
    const path: string = `${drive}:/${pathStore}`;
    fs.existsSync(path) || fs.mkdirSync(path, { recursive: true });
  }

}
