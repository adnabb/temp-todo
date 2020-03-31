const fs = require('fs');
const os = require('os');
const path = require('path');
const { db } = require('../config');
const homeDir = os.homedir();
const home = process.env.HOME || homeDir;
const dbPath = path.join(home, db);

let list;

module.exports = {
  read: () => {
    return new Promise((resolve) => {
      fs.readFile(dbPath, { encoding: 'utf8', flag: 'a+' }, (err, data) => {
        if (err) throw err;
        if (data) {
          list = JSON.parse(data);
        } else {
          list = [];
        }
        resolve(list);
      });
    });
  },
  write: (list) => {
    return new Promise((resolve) => {
      fs.writeFile(dbPath, JSON.stringify(list), { flag: 'w' }, (err) => {
        if (err) throw err;
        resolve();
      });
    });
  },
}