# Dart运行机制

> Dart和Javascript的运行机制类似（都是单线程）

见下图：

![Event_Loop](/md/img/dart_loop.png)

其中：`Future`是微任务（当然，Future几乎就是Promise）