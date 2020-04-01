const fs = require('fs');
const os = require('os');
const path = require('path');
const { fileName } = require('../config');
const homeDir = os.homedir();
const home = process.env.HOME || homeDir;
const dbPath = path.join(home, fileName);

let list;

module.exports = {
  read: (path=dbPath) => {
    return new Promise((resolve) => {
      fs.readFile(path, { encoding: 'utf8', flag: 'a+' }, (err, data) => {
        if (err) throw err;
        if (data) { list = JSON.parse(data); } else { list = []; }
        resolve(list);
      });
    });
  },
  write: (list, path=dbPath) => {
    return new Promise((resolve) => {
      fs.writeFile(path, JSON.stringify(list), { flag: 'w' }, (err) => {
        if (err) throw err;
        resolve();
      });
    });
  },
}