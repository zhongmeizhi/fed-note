
  
  * [腾讯新闻前端周报](https://github.com/Tnfe/TNFE-Weekly)
  * [underscore](https://github.com/lessfish/underscore-analysis)
  * [领扣-解题](https://github.com/azl397985856/leetcode)
  * [领扣-动画](https://github.com/MisterBooo/LeetCodeAnimation)
  * [冴羽大佬博客](https://github.com/mqyqingfeng/Blog)
  * [koa2 进阶](https://github.com/chenshenhai/koa2-note)
  * [机器学习](https://github.com/apachecn/AiLearning)

工具
  * [网页 转 markdown](https://github.com/croqaz/clean-mark)
    1. `npm install clean-mark --global`
    2. `cd 承载目录`
    3. `clean-mark url`
  * [markdown 在线免费转 html](http://md.aclickall.com/)

小方法
  * 同时启动 多个微信：
  * 利用 `.bat` 添加，运行命令，几行就几个。
  * `start/d "C:\Program Files (x86)\Tencent\WeChat\" Wechat.exe`


### 凡是要抽象的要抽象

每个项目都应该有一个规范，`eslint`代码规范只是具象化的提示实现，但代码规范不仅仅局限于 `eslint`，还应该包含：
* 属性方法命名规范
* 文件规范
* 引用类型数据的处理方式，比如
  * 核心：可维护。
  * 尽量不更改引用，特别是组件间的引用更改！！！
  * 函数式编程
  * 面向对象编程
* 组件如何分类
  * 公共部分需要内部组件库
  * 非公共部分按功能 + 模块分类
* 控制器（controller）
  * 稍微复杂的功能需要使用控制器，以便抽象、复用、改造
* 工具方法
  * 公共工具方法使用内部工具库
  * 能抽象的方法按照功能分类
* 样式
  * 首先要做的是 reset.css 和常用 class
  * 每个项目都有一个主题色和特定宽高 class 主题