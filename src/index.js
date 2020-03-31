const db = require('./db');
const inquirer = require('inquirer');

let list;
let listFilterCondition = '';

const add = async (argv) => {
  const params = argv.slice(3);
  const tasks = params.map(name => ({ name, status: false }));
  list = await db.read();
  await db.write([...list, ...tasks]);
  console.info(`"${params}"添加成功`);
};

const statusMap = { todo: false, done: true, };

const filterList = (list) => {
  if (listFilterCondition === 'todo' || listFilterCondition === 'done') return list.filter((item) => item.status === statusMap[listFilterCondition]);

  return list;
}

const sortList = (list) => { return list.sort((a, b) => a.status - b.status); }

const showListAndSelectTask = async () => {
  list = await db.read();

  const filterdList = sortList(filterList(list));
  if (!filterdList.length) { console.info('there is no relative task'); return; }

  const _list = JSON.parse(JSON.stringify(filterdList))
    .map((item) => item.name = `[${item.status ? 'x' : '_'}] ${item.name}`)
    .sort((a, b) => a.status - b.status);

  return inquirer
    .prompt([
      {
        type: 'list',
        message: 'Select task',
        name: 'selected',
        choices: [..._list],
        filter: (showName) => {
          const name = showName.slice(3).trim();
          return filterdList.filter((item) => item.name === name)[0];
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
        choices: [...actions],
      }
    ]).then((res) => {
      return res;
    });
}

const commonHandle = async (list, message) => {
  await db.write(list);
  console.info(message);
  handleList(listFilterCondition);
}

const changeTaskStatus = async (index) => {
  list[index].status = !list[index].status;
  await commonHandle(list, 'status changed!');
}

const deleteTask = async (index) => {
  list.splice(index, 1);
  await commonHandle(list, 'delete successfully!');
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
  handleList(listFilterCondition);
}

const actionMap = {
  done: changeTaskStatus,
  todo: changeTaskStatus,
  delete: deleteTask,
  edit: editTaskName,
};

const handleTask = async (task) => {
  const customActions = [task.status ? 'todo' : 'done', 'edit', 'delete', 'back'];
  const { action: chosenAction } = await chooseAction(customActions);

  if (chosenAction === 'back') {
    handleList(listFilterCondition);
    return;
  }

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item.name === task.name) { actionMap[chosenAction](i); }
  }
}

const handleList = async (filterCondition = '') => {
  listFilterCondition = filterCondition;
  const selected = await showListAndSelectTask();
  if (selected) await handleTask(selected.selected);
}

const getClearedList = (list, clearCondition) => {
  if (clearCondition === 'todo' || clearCondition === 'done') {
    return list.filter((item) => item.status !== statusMap[clearCondition]);
  }

  return [];
}

const clear = async (clearCondition) => {
  list = await db.read();
  const cleardList = getClearedList(list, clearCondition);
  await db.write(cleardList);
  console.info(`${clearCondition || 'all'} cleared`);
  handleList();
}

module.exports = {
  add,
  handleList,
  clear,
};
