#!/usr/bin/env node

const { program } = require('commander');
const config = require('../package.json');
const api = require('./index');
const version = config.version;

  program.version(version);

  program
  .command('add <task>')
  .description('add (a) task(s)')
  .action(() => api.add(process.argv));

  program
  .command('list')
  .option('[todo|done], list todo/done/add lists')
  .description('add (a) task(s)')
  .action((env) => {
    api.handleList(env.args[0]);
  });

  program
  .command('clear')
  .option('[todo|done], clear todo/done/add lists')
  .description('clear tasks')
  .action((env) => {
    api.clear(env.args[0]);
  });

  program.parse(process.argv);
