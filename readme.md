# 介绍

temp-todo是一款暂时备忘录，当我们在编程时突然想到一些事情可以临时记录，提供标记是否完成、任务名称编辑、任务删除等功能。

## 使用

全局安装
```
yarn global add temp-todo
// or
npm install -g temp-todo
```

下载完成后可以直接执行命令t -h查看所有命令

```
t -h
```

---

特别的，如果曾经安装但需要更新请先全局卸载后再次安装

```
yarn global remove temp-todo
yarn global add temp-todo
```

## 功能介绍

1. 添加新任务（添加多个任务用分号隔开，**中英文状态下的分号均可**）
```
t add 你想添加的备忘1；你想添加的备忘2；aa;vv ...
```

1. 查看todo list列表，可选择任意task后对其进行一下操作：

- 状态修改（切换todo或done）
- 内容修改
- 删除
- 返回上一级

```
t ls
```
**支持直接输入t，查询全部列表**

**支持部分查询,** 只查询todo列表 `t ls todo`，只查询done列表`t ls done`

1. 清空todo list清单

```
t clear all// 清空全部

t clear todo // 清空已完成列表

t clear done // 清空未完成列表
```