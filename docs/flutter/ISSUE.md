# Flutter 使用经验

### 更改 Flutter 桌面项目名

* Android 是在 AndroidManifest.xml 中修改
  * flutter_ui\android\app\src\main\AndroidManifest.xml
  * 修改 `android:label="蘑菇碳"`
* iOS 则是在 Info.plist 中修改的
  * flutter_ui\ios\Runner\Info.plist
  * 修改`<key>CFBundleName</key>`下面的`<string>蘑菇碳<string>`

### 更改 Flutter 桌面项目图片

* Android 在 flutter_ui\android\app\src\main\res 下各种规格图片
* ios 在 flutter_ui\ios\Runner\Assets.xcassets\AppIcon.appiconset 下配置

### Hero 使用

1. Hero 一个页面相同Tag的Hero只能有1个
2. Hero需要 tag 配对
4. Hero会从start到end的**Route**间"飞"哦.

注意点：
* Hero不能包裹Button（会报错：`widgets require a Material widget ancestor.`）


### 在State内使用widget元素

> 在State内使用widget获取Wideget元素时必须加泛型

```
    class _XXXState extends State<XXXPage> {
        // 这样 widget 就指向 XXXPage 
    }
```

### PageView 状态保存

> 解决：with AutomaticKeepAliveClientMixin 然后重写 wantKeepAlive = true

注意事项：
* 如果：body中并没有使用PageView或TabBarView
* 那么 wantKeepAlive 将无效

### 国际化

> 在默认情况下,Flutter只支持英文，本文讲解一下Flutter国际化的一些用法

解决步骤：
1. 在pubspec.yaml文件中添加依赖`flutter_localizations`
    ```
        dependencies:
            flutter_localizations:
                sdk: flutter
    ```
2. 运行`flutter packages get`
3. 在MaterialApp中设置本地化代理
    ```
    MaterialApp(
        localizationsDelegates:  [ // 本地化代理
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
        ],
        supportedLocales: [
            const Locale('en', 'US'), // 美国英语
            const Locale('zh', 'CN'), // 中文简体
            //其它Locales
        ],
    )
    ```
4. 在指定Widget处使用
    ```
        // 如
        showDatePicker(
            locale: Locale('zh', 'CN'),
        )
    ```



