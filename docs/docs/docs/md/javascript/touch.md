# 移动端touch

touch
	touchstart
	touchmove
	touchend
	

手势难点
1. 手势识别
	缩放，旋转
2. 方向锁定
3. 

touch的事件有，event.targetTouchs，数组，目标dom的触摸数。
如果是多指代表最中间点
拖拽时要在touchstart事件中 e.preventDefault()来阻止页面的滚动效果，
每个touch都有 identifier表示ID




单点触摸，使用 event.targetTouchs[0]

多点触摸：
	目标dom的event.targetTouchs表示目标的触摸手指数组
  多点触摸有在touchend触发时当前dom的所有touch事件都remove掉
  需要使用event.changedTouches来寻找离开的手指的 identifier来判断是否离开
  
  
  
原生的额touch 和 websocket很难用
分别用 iscroll 、 hammer  和 socketio



拖拽方向锁定
。上下拖的时候阻止左右拖，左右同理


获取transform属性基本上不能，因为通过js获取到的是矩阵，
但是获得一个矩阵的transform可以有多个，比如scale+skew可以等于rotate



调试手机端可以用 browser-sync完成多端同步（利用socket.io完成的）


在if里面放函数是很不好的行为，因为在不同的浏览器执行的结果可能不一样，
	在严格模式还会报错


