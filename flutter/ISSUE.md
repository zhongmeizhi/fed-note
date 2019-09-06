# Flutter 使用经验

> 自己mark一下

## 更改 Flutter 桌面项目名

* Android 是在 AndroidManifest.xml 中修改
  * flutter_ui\android\app\src\main\AndroidManifest.xml
  * 修改 `android:label="蘑菇碳"`
* iOS 则是在 Info.plist 中修改的
  * flutter_ui\ios\Runner\Info.plist
  * 修改`<key>CFBundleName</key>`下面的`<string>蘑菇碳<string>`

## 更改 Flutter 桌面项目图片

* Android 在 flutter_ui\android\app\src\main\res 下各种规格图片
* ios 在 flutter_ui\ios\Runner\Assets.xcassets\AppIcon.appiconset 下配置


## 配置不同的运行环境

> 区分开发、测试、生产环境

* 运行：`flutter run -target lib/main_dev.dart` （`-target` 可以缩小为 `-t`）
* 打包：`flutter build apk -t lib/main_prod.dart` （ios同理）

当然`:)`如果通过编辑器/.bat来配置就更完美了。


### [返回主页](/README.md)
