# 国际化

在默认情况下,Flutter只支持英文，本文讲解一下Flutter国际化的一些用法

### 步骤：
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
