const { program } = require('commander');
const inquirer = require('inquirer');
const config = require('../package.json');
const api = require('./index');
const version = config.version;

program
  .version(version)
  .option('add', 'add a task')
  .option('list', 'show your todo list')
  .option('clear', 'clear todo list')
  .parse(process.argv);


const { argv } = process;
command = argv[2];

const actions = ['done', 'edit', 'delete', 'exit'];

const add = () => {
  // TODO:添加的任务名不可以重复
  const content = argv.slice(3).join(' ').trim();
  api.read().then((list) => {
    list.push({ name: content, status: false });
    return api.write(list).then(() => console.log(`"${content}"添加成功`));
  });
}

const clear = () => {
  list = [];
  api.write(list).then(() => {
    console.log('cleared');
  });
}

const showList = (list) => {
  const _list = JSON.parse(JSON.stringify(list))
    .map((item) => item.name = `[${item.status ? 'x' : '_'}] ${item.name}`)
    .sort((a, b) => a.status - b.status);

  return inquirer
    .prompt([
      {
        type: 'list',
        message: 'Select task',
        name: 'selected',
        choices: [
          ..._list,
        ],
        filter: (showName) => {
          const name = showName.slice(3).trim();
          return list.filter((item) => item.name === name)[0];
        },
      }
    ]);
};

const handleTask = (task) => {
  const name = task.name.trim();

  return inquirer
    .prompt([
      {
        type: 'list',
        message: 'Select action',
        name: 'action',
        choices: [
          ...actions,
        ],
        filter: (action) => {
          return { name, action };
        },
      }
    ])
}

const commonHandle = (list, message) => {
  return api.write(list).then(() => {
    console.log(message);
  });
}

const editTaskName = (list, index) => {
  return inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: "you can change your taskName now",
    filter: (name) => {
      list[index].name = name;
      return list;
    },
  }]).then(answers => {
    return api.write(answers.name).then(() => {
      console.log('edit successfully!');
    });
  });
}

if (command === 'add') { add(); }

if (command === 'clear') { clear(); }

if (command === 'list') {
  api.read().then((list) => {
    if (!list.length) {
      // TODO: do you want to add some?
      console.log('there is no task, you can add some');
      return;
    }

    showList(list).then(selected => {
      console.log('selected', selected);
      const { selected: selectedItem } = selected;

      if (selectedItem.status) actions[actions.indexOf('done')] = 'todo';
      handleTask(selectedItem).then((action) => {
        const { action: currentAction, name: taskName } = action.action;
        console.log(action.action);
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (item.name === taskName) {
            if (currentAction === 'done' || currentAction === 'todo') {
              item.status = !item.status;
              return commonHandle(list, 'status changed!');
            } else if (currentAction === 'delete') {
              list.splice(i, 1);
              return commonHandle(list, 'delete successfully!');
            } else if (currentAction === 'edit') {
              return editTaskName(list, i);
            }
          }
        }
      })
    });
  })
}
