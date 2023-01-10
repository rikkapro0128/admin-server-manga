import fs from 'fs';

export default new class CheckPath {

  storage(root: string, floder: string) {
    const path: string = `${root}/${floder}`;
    fs.existsSync(path) || fs.mkdirSync(path, { recursive: true });
  }

  createIfNot(path: string) { 
    if (!fs.existsSync(path)) { fs.mkdirSync(path, { recursive: true }) }
  }

}
