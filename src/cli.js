#!/usr/bin/env node

const { program } = require('commander');
const config = require('../package.json');
const api = require('./index');
const version = config.version;

program.version(version).name('t');

const setCommand = () => {
  program
    .command('ls')
    .option('[todo|done], list todo/done/add lists')
    .description('list tasks and handle it')
    .action((env) => {
      api.handleList(env.args[0]);
    });

  program
    .command('add <task>')
    .description('add (a) task(s)')
    .action(() => api.add(process.argv));

  program
    .command('clear')
    .option('[todo|done], clear todo/done/add lists')
    .description('clear tasks')
    .action((env) => {
      api.clear(env.args[0]);
    });
};

// 如果这里不做判断，不输入参数的时候list出不来
if (process.argv.length === 2) { api.handleList(); } else { setCommand(); }

program.parse(process.argv);
