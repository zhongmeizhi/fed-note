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
3. Hero会从start到end的Route中"飞"哦.

注意点：
* Hero不能包裹Button（会报错：`widgets require a Material widget ancestor.`）

.

### IndexedStack

* `IndexedStack` 显示第index个child，其它child在页面上是不可见的
* 虽然其他child不可见,但是: 在初始化IndexedStack时,所有的child都会被渲染

.

### Container

* 在容器中: `color`属性和`decoration`属性不能同时存在
* 其中: decoration 可以设置color属性.

.

### BoxDecoration

* borderRadius 和 shape: BoxShape.circle 同时使用 会报错

.

### ListView与Column的冲突问题

跟列有关的 Colum、Flex、Expanded 扩展Widget都会Error

> `会铺满整屏幕的Widget`与`屏幕能扩展滚动的ListView` 放在ListView中很容易报错

解决方案： 使用`限制高度的Widget`（如ConstrainedBox、SizedBox）来包裹Column


### 状态问题

通过请求获取数据，使用for循环List.add()动态拼接返回items。在setSate时items不会重新渲染

> 原因 TODO： 可能是State的问题

解决方案：items拼接过程单独挪到class外部。那么就能重新渲染了

.

### 在State内使用widget元素

> 在State内使用widget获取Wideget元素时必须加泛型

```
    class _XXXState extends State<XXXPage> {
        // 这样 widget 就指向 XXXPage 
    }
```

.

### PageView 状态保存

> 解决：with AutomaticKeepAliveClientMixin 然后重写 wantKeepAlive = true

注意事项：
* 如果：body中并没有使用PageView或TabBarView
* 那么 wantKeepAlive 将无效


### [返回主页](/README.md)