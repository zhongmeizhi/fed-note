# flutter环境搭建

## 安装
* 安装 flutter SDK
> git clone https://github.com/flutter/flutter.git

* 配置 flutter 环境变量
> 将bin目录配置到path中

* 安装 Android Studio
> https://developer.android.google.cn/studio/

## 环境配置
* 添加 监听
> flutter doctor --android-licenses

## 使用vsCode开发
  1. 安装 flutter插件
  2. 查看 -> 命令面板 -> 输入 doctor
    -> 选择 Flutter: Run Flutter Doctor
    -> 查看OUTPUT窗口是否有问题
  3. 重启vsCode -> 查看 -> 命令面板 -> 输入 flutter
    -> 选择 Flutter: New Project

## 使用Android Studio开发
  1. 打开插件首选项
      macOS：Preferences -> Plugins
      Windows：File -> Settings -> Plugins
  2. 选择 Browse repositories… -> 选择 flutter 插件并点击 install
  
## 开启热重载
  1. 打开lib/main.dart文件
  2. 将You have pushed the button this many times中pushed改成 checked
  3. 用热重载按钮(闪电图标/绿色圆形箭头按钮)

## 连接Android模拟器
* Tools -> AVD Manager -> Create Virtual Device. -> 直到finish
* 将 ADB 添加到环境变量
   1. Settings -> Appearance -> system setting -> android sdk (copy sdk 路径)
   2. 添加 Sdk\platform-tools 到环境变量

## extract
* 检验环境是否安装成功
  > flutter doctor
* 如果在能使用android模拟器却不能flutter run
  * 以管理员身份运行 android studio
  * 清除as缓存 File -> Invalidate Caches
  * 安卓版本太高，降级到8.1。（flutter版本 1.2.1）
	
> 文章分享同步于： https://github.com/zhongmeizhi/gitbook-FED
  ## [返回主页](/README.md)
