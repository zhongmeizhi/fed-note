# Flutter 入门 && 适配

Flutter借鉴的是React思想，使用的是Widget组件

本文只写`官网很难找到`或者`官网压根没有的`Fluter日常踩坑。

### 静态文件引入
1. 打开根目录中的`pubspec.yaml`文件
    ```
    // 配置 assets

    assets:
    - assets/images/xxx.jpg
    ```
2. 在Widget中使用即可
    ```
    Image.asset('assets/images/xxx.jpg',
    ```

### 屏幕适配
1. 打开根目录中的`pubspec.yaml`文件
   > 添加 flutter_screenutil 插件
    ```
    dependencies:
        flutter:
            sdk: flutter
        flutter_screenutil: ^0.4.2
    ```
2. 在所有的使用处引入插件（肯定的咯）
    ```
    import 'package:flutter_screenutil/flutter_screenutil.dart';
    ```
3. 在`MaterialApp`的`home`的Widget中确认设计稿宽高
   > 拟定宽高 width=750; height=1334;
    ```
    // Widget build(BuildContext context) { 后面添加

    ScreenUtil.instance = ScreenUtil(width: 750, height: 1334)..init(context);
    ```
4. 使用
   ```
    width: ScreenUtil().setWidth(750)
   ```

### 字体适配
> 适配方案大致同上，略有不同
```
    ScreenUtil().setSp(28)
```

### 颜色使用
* 自带颜色 `Colors.red`
* 自义颜色 `Color(0xFF333333)`
   * 0xFF表示透明度16进制， 之后的333333代表RGB色值

## End
> 文章分享同步于： https://github.com/zhongmeizhi/gitbook-FED
### [返回主页](/README.md)
