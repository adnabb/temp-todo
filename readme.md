# 介绍

temp-todo是一款暂时备忘录，当我们在编程时突然想到一些事情可以临时记录，提供标记是否完成、任务名称编辑、任务删除等功能。

## 使用

全局安装
```
yarn add global temp-todo
// or
npm install -g temp-todo
``

下载完成后可以直接执行命令t

```
t
```

## 功能介绍

1. 查看todo list列表，可选择任意task后对其进行

- 状态修改（切换todo或done）
- 内容修改
- 删除
- 返回上一级

```
t ls
```

2. 添加新任务（添加多个任务用空格隔开）
```
t add 你想添加的备忘1 你想添加的备忘2 ...
```

3. 清空todo list清单（默认全部清空）

```
t clear // 清空全部

t clear todo // 清空已完成列表

t clear done // 清空未完成列表
```