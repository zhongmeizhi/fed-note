# Flutter 经验之谈

.

\[ListView与Column的冲突问题\]

跟列有关的 Colum、Flex、Expanded 扩展Widget都会Error

> `会铺满整屏幕的Widget`与`屏幕能扩展滚动的ListView` 放在ListView中很容易报错

解决方案： 使用`限制高度的Widget`（如ConstrainedBox、SizedBox）来包裹Column

.

\[Windows开发环境 访问localhost\]

访问会报错：SocketException: OS Error: Connection refused

> android模拟器中使用 localhost会指向模拟机本机

解决方案： 在控制台运行：`adb reverse tcp:8080 tcp:8080`

.

\[状态问题\]

通过请求获取数据，使用for循环List.add()动态拼接返回items。在setSate时items不会重新渲染

> 原因 TODO： 可能是State的问题

解决方案：items拼接过程单独挪到class外部。那么就能重新渲染了

.

\[在State内使用widget元素\]

是State内使用widget获取Wideget元素时必须加泛型
```
    class _XXXState extends State<XXXPage> {
        // 这样 widget 就指向 XXXPage 
    }
```


## End

> 持续更新中 [来Github 点颗⭐吧](https://github.com/zhongmeizhi/Interview-Knowledge-FED)

### [返回主页](/README.md)