厂家平台服务器设置
===============

服务器：ubuntu32位

需要软件：

  1. node
  2. mysql
  3. pm2

***

###node安装

1.下载安装包

```
wget https://nodejs.org/dist/v4.4.3/node-v4.4.3-linux-x86.tar.xz
```

2.解压

```
$xz -d ***.**tar.xz**
$tar -xvf  ***.tar
```

3.写入环境变量

这个安装包集成了node的模块管理工具npm，也一起加进去

```
sudo vim 路径/.profile 
//末尾添加
export PATH="$PATH:node-*********/bin"
//保存退出VIM之后
source 路径/.profile
```

***

###mysql配置

数据库连接配置文件放在

```
工程目录/database/db.js
```

数据库结构sql文件放在

```
工程目录/sqlBackup
```

***

###pm2

1.安装

```
npm install -g pm2
```

2.启动服务

```
cd 工程目录
pm2 start bin/www
```

**注意**：bin/www里面是http服务器的配置文件，修改端口号可以在这里修改

***

###使用之前

根据业务逻辑，顶级管理员不能注册，必须事先预置，所以我会在管理员表里预置顶级管理员账号

账号：xiangxuan.qu@hekr.me

密码：123456

***

###api文档

* [排行榜api](https://shimo.im/doc/SD1KzE39RxQMcKtt)
* [用户反馈api](https://shimo.im/doc/d7ubh0p47XEmP3Zo)
* [App管理api](https://shimo.im/doc/QdcxUMrFgu8dLvuo)
* [商城管理api](https://shimo.im/doc/81Zku7a1yewK2dLa)

***

###扩展阅读

* [商城逻辑](https://shimo.im/doc/gvGgY7abTI05xPkG)
* [脑图](http://naotu.baidu.com/file/47b8c9fda91a95ff9967b990046a7dca?token=366e7c75ab1704cc)
