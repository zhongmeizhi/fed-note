# 前端微服务

微服务使用 `single-spa`框架

子项目：
* 在开发或者单独部署时，按照各自风格编写。
* 如果要集成微服务架构，需要再设置单独的打包方式，以引入`single-spa-vue`或者其他单页面插件的js文件作为入口。
* 需要打包为 `library`，target可以是umd或者其他方式。
```
  libraryTarget: 'umd',
	library: 'app1'
```

根项目：
* 引入`single-spa`
* 通过`spa.registerApplication`的方式，在遇到特定`href`时加载不同的打包子项目入口文件
* 在开发环境，通过代理来实现不同的遇到特定`href`代理不同的子项目。