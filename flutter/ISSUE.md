# Flutter 经验之谈

.

### ListView与Column的冲突问题

跟列有关的 Colum、Flex、Expanded 扩展Widget都会Error

> `会铺满整屏幕的Widget`与`屏幕能扩展滚动的ListView` 放在ListView中很容易报错

解决方案： 使用`限制高度的Widget`（如ConstrainedBox、SizedBox）来包裹Column

.

### Windows开发环境 访问localhost

访问会报错：SocketException: OS Error: Connection refused

> android模拟器中使用 localhost会指向模拟机本机

解决方案： 在控制台运行：`adb reverse tcp:8080 tcp:8080`

解决方案2： 直接访问自己的IP 如： `http://10.93.157.10:2333`

.

### android无法联网问题

> emulator -avd 虚拟机名称 -dns-server 8.8.8.8,114.114.114.114

1. 进入 C:\Users\zmz\.android\avd 查看虚拟机名称
2. 进入 C:\Users\zmz\AppData\Local\Android\Sdk\emulator 打开控制台
3. 运行`emulator -avd 虚拟机名称 -dns-server 8.8.8.8,114.114.114.114`

.

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

### Unhandled Exception: MissingPluginException(No implementation found for method

> 没有插件包

解决方案：
```
    flutter clean
    flutter packages get
```

### Unhandled exception: setState() called after dispose()

> 在 Flutter 构件树被销毁后仍然执行了 setState 方法改变页面状态。

解决方案：
```
    // mounted 为 false 时未挂载当前页面
    if (!mounted) {
        return;
    }
    setState(() {
        // 做一些事情
    });
```

.

### PageView 状态保存

> 解决：with AutomaticKeepAliveClientMixin 然后重写 wantKeepAlive = true

注意事项：
* 如果：body中并没有使用PageView或TabBarView
* 那么 wantKeepAlive 将无效

## End

> 持续更新中 [来Github 点颗⭐吧](https://github.com/zhongmeizhi/Interview-Knowledge-FED)

### [返回主页](/README.md)