# 简介

[![Build Status](https://travis-ci.org/lifei6671/mindoc.svg?branch=master)](https://travis-ci.org/lifei6671/mindoc)
[![Build status](https://ci.appveyor.com/api/projects/status/ik70whjrioyvfy18/branch/master?svg=true)](https://ci.appveyor.com/project/lifei6671/godoc/branch/master)
本开发基于MinDoc。

MinDoc 是一款针对IT团队开发的简单好用的文档管理系统。 

MinDoc 的前身是 SmartWiki 文档系统。SmartWiki 是基于 PHP 框架 laravel 开发的一款文档管理系统。因 PHP 的部署对普通用户来说太复杂，所以改用 Golang 开发。可以方便用户部署和实用。

开发缘起是公司IT部门需要一款简单实用的项目接口文档管理和分享的系统。其功能和界面源于 kancloud 。 

可以用来储存日常接口文档，数据库字典，手册说明等文档。内置项目管理，用户管理，权限管理等功能，能够满足大部分中小团队的文档管理需求。

演示站点： [http://doc.iminho.me](http://doc.iminho.me)

# 安装与使用

**如果你的服务器上没有安装golang程序请手动设置一个环境变量如下：键名为 ZONEINFO，值为MinDoc跟目录下的/lib/time/zoneinfo.zip 。**

更多信息请查看手册： [MinDoc 使用手册](https://github.com/lifei6671/mindoc/wiki)

对于没有Golang使用经验的用户，可以从 [https://github.com/lifei6671/mindoc/releases](https://github.com/lifei6671/mindoc/releases) 这里下载编译完的程序。

如果有Golang开发经验，建议通过编译安装。

```bash
git clone https://github.com/lifei6671/mindoc.git

glide update

go build -ldflags "-w"

./mindoc install

./mindoc

```

MinDoc 使用MySQL储存数据，且编码必须是`utf8mb4_general_ci`。请在安装前，把数据库配置填充到项目目录下的 conf/app.conf 中。

如果conf目录下不存在 app.conf 请重命名 app.conf.example 为 app.conf。
 
**默认程序会自动初始化一个超级管理员用户：admin 密码：123456 。请登录后重新设置密码。**

## Linux 下后台运行

在 Linux 如果想让程序后台运行可以执行如下命令：

```bash
#使程序后台运行
nohup ./mindoc &
```

该命令会使程序后台执行，但是服务器重启后不会自动启动服务。

使用 supervisor 做服务，可以使服务器重启后自动重启 MinDoc。

## Windows 下后台运行

Windows 下后台运行需要借助 CMD 命令行命令：

```bash
#在MinDoc跟目录下新建一个slave.vbs文件：

Set ws = CreateObject("Wscript.Shell") 
ws.run "cmd /c start.bat",vbhide 

#再建一个start.bat文件：
@echo off

mindoc_windows_amd64.exe

```

启动时双击slave.vbs即可，等待程序初始化完数据库会在该目录下创建一个install.lock文件，标识已安装成功。

如果是自己编译，可以用以下命令即可编译出不依赖cmd命令的后台运行的程序：

```bash
go build -ldflags "-H=windowsgui"
```
通过该命令编译的Golang程序在Windows上默认后台运行。

请将将 MinDoc 加入开机启动列表，使程序开机启动。

# 项目截图

**网站首页**

![项目设置](https://github.com/samdebug/Beego-web/raw/master/screenshots/1.png)

**创建目标库**

![创建项目](https://github.com/samdebug/Beego-web/raw/master/screenshots/2.png)

**目标库列表**

![项目列表](https://github.com/samdebug/Beego-web/raw/master/screenshots/3.png)

**人脸库**

![项目概述](https://github.com/samdebug/Beego-web/raw/master/screenshots/4.png)

**账号设置**

![项目成员](https://github.com/samdebug/Beego-web/raw/master/screenshots/5.png)


# 使用的技术

- beego 1.8.1
- mysql 5.6
- bootstrap 3.2
- vuejs 2.0
- jquery 2.1
- layer 弹出层框架
- webuploader 文件上传框架
- Nprogress 库
- jstree 树状结构库
- font awesome 字体库
- cropper 图片剪裁库
- layer 弹出层框架


# 主要功能

- 实时监控，可对视频文件进行实时监控。
- 目标库管理，添加和删除对比目标库等。
- 视频源管理，可以管理视频源文件。
- 布控任务，开始和停止布控任务。
- 人脸检索 ， 1：N的检索功能。
- 历史记录，可以查看所有对比记录。
- 数据统计，使数据图像化。

# 关于作者

学习使我快乐 。
