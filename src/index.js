const db = require('./db');
const inquirer = require('inquirer');

let list;

const add = async (argv) => {
  const params = argv.slice(3);
  const tasks = params.map(name => ({
    name, status: false
  }));
  list = await db.read();
  await db.write([...list, ...tasks]);
  console.info(`"${params}"添加成功`);
};

const statusMap = {
  todo: false,
  done: true,
};

const showListAndSelectTask = async (filterCondition) => {
  list = await db.read();

  if (filterCondition === 'todo' || filterCondition === 'done') list = list.filter((item) => item.status === statusMap[filterCondition]);
  if (!list.length) { console.info('there is no relative task'); return; }

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

const chooseAction = async (actions) => {
  return inquirer
    .prompt([
      {
        type: 'list',
        message: 'Select action',
        name: 'action',
        choices: [
          ...actions,
        ],
      }
    ]).then((res) => {
      return res;
    });
}

const commonHandle = async (message) => {
  await db.write(list);
  console.info(message);
}

const changeTaskStatus = (index) => {
  list[index].status = !list[index].status;
   commonHandle(list, 'status changed!');
}

const deleteTask = (index) => {
  list.splice(index, 1);
  return commonHandle(list, 'delete successfully!');
}

const editTaskName = async (index) => {
  const editedList = await inquirer.prompt([{
    type: 'input',
    name: 'list',
    message: "you can change your taskName now",
    filter: (name) => {
      list[index].name = name;
      return list;
    },
  }]);
  await db.write(editedList.list);
  console.info('edit successfully!');
}

const actionMap = {
  done: changeTaskStatus,
  todo: changeTaskStatus,
  delete: deleteTask,
  edit: editTaskName,
};

const handleTask = async (task) => {
  const actions = [task.status ? 'todo' : 'done', 'edit', 'delete'];
  const chosenAction = await chooseAction(actions);

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item.name === task.name) actionMap[chosenAction.action](i);
  }
}

const handleList = async (filterCondition) => {
  const selected = await showListAndSelectTask(filterCondition);
  if (selected) await handleTask(selected.selected);
}

const clear = async (filterCondition) => {
  list = await db.read();
  if (filterCondition === 'todo' || filterCondition === 'done') {
    list = list.filter((item) => item.status !== statusMap[filterCondition]);
  } else { list = []; }
  await db.write(list);
  console.info('cleared');
}

module.exports = {
  add,
  handleList,
  clear,
};
