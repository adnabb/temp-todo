const db = require('../src/db');
const fs = require('fs');

jest.mock('fs');

describe('db', () => {
  afterEach(() => {
    fs.clearMock();
  });
  test('read is a function', () => {
    expect(db.read instanceof Function).toBeTruthy();
  });
  test('write is a function', () => {
    expect(db.write instanceof Function).toBeTruthy();
  });
  test('can read', async() => {
    const taskList = [{ name: 'do unit test', status: false }];
    fs.setReadFileMock('/xxx', null, JSON.stringify(taskList));
    const list = await db.read('/xxx');
    expect(list).toStrictEqual(taskList);
  });
  test('can write', () => {
    const taskList = [{ name: 'write diary', status: false }];
    let fakeData;
    fs.setWriteFileMock('/yyy', (path, data, options, callback) => {
      fakeData = data;
    });
    fs.writeFile('/yyy', taskList, null, null);
    expect(fakeData).toStrictEqual(taskList);
  });
});