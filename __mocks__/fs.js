const fs = jest.genMockFromModule('fs');
const __fs = jest.requireActual('fs');

Object.assign(fs, __fs);

let __readMock = {};

fs.setReadFileMock = (path, error, data) => {
  __readMock[path] = [error, data];
}

fs.readFile = (path, options, callback) => {
  if (!callback) callback = options;
  if (__readMock[path]) {
    callback(__readMock[path][0], __readMock[path][1]);
  } else {
    fs.readFile(path, options, callback);
  }
}

let __writeMock = {};

fs.setWriteFileMock = (path, fn) => {
  __writeMock[path] = fn;
}

fs.writeFile = (path, data, options, callback) => {
  if (!callback) callback = options;
  if (path in __writeMock) {
    __writeMock[path](path, data, options, callback);
  } else {
    fs.writeFile(path, data, options, callback);
  }
}

fs.clearMock = () => {
  __readMock = {};
  __writeMock = {};
}



module.exports = fs;