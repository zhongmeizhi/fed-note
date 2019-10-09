# RxDart

但是 Future 只能表示一次异步获得的数据。而 Stream 表示多次异步获得的数据。Stream 其实也是个数据集合

比如界面上的按钮可能会被用户点击多次，所以按钮上的点击事件（onClick）就是一个 Stream 。

简单地说，Future将返回一个值，而Stream将返回多次值。

虽然Future和Stream都是异步的，但是RxDart的Observable默认是同步的。


RxDart 融合了Steam的优点