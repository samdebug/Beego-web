人脸与身份证对比系统软件 （for win）
====================

### 软件截图

![Alt text](https://github.com/samdebug/NWJS-Face-App/raw/master/screenshots/1.png)
![Alt text](https://github.com/samdebug/NWJS-Face-App/raw/master/screenshots/2.png)
![Alt text](https://github.com/samdebug/NWJS-Face-App/raw/master/screenshots/3.png)
![Alt text](https://github.com/samdebug/NWJS-Face-App/raw/master/screenshots/4.png)

### 硬件要求 

1. IDIWAY身份证读卡器
2. 任意usb摄像头

### 安装要求（Node-Webkit 自动化打包）

1. Node.js
2. Grunt-CLI
3. 读卡器循环读取后台程序

### 平台搭建

1. 安装Node.js
2. 安装Grunt, `npm install -g grunt-cli`
3. 拉取本Repo, `git clone `
4. 拉取Zadmin, `git clone git@bitbucket.org:zexabox/zadmin.git src`
5. 安装相应的依赖包, `npm install`
6. 依赖包 `grunt-contrib-clean`, `grunt-contrib-coffee`, `grunt-contrib-copy`, `grunt-contrib-jade`, `grunt-contrib-uglify`, `grunt-node-webkit-builder`, `grunt-scp`, `grunt-zip-directories`

### 构建APP

在完成平台搭建后，输入`grunt`即可自动打包APP
