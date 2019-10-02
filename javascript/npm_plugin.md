# NPM 私有库 插件

### NPM私有库搭建
* 使用`verdaccio`搭建服务 `npm install –global verdaccio`
* 然后就运行`verdaccio`再设置账户和密码
* 然后就可以cd到需要作为插件的目录`npm publish`

### 插件制作

运行`npm init`生成`package.json`

`package.json`将作为插件的配置文件
* "name": 表示插件的名称
* "private": 必须为 true
* "main": 作为插件的入口文件

在根目录下新建个 .npmignore，在npm在发布时会忽略项目中的文件。

### 插件注意项
* 插件如果不打包作为入口，那么webpack的alias在插件中会不能使用

### 插件的联调
* 可以通过使用 `npm-link`来联调插件