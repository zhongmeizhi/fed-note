# deferred 对象

jQuery的传统ajax操作
```
$.ajax({
  url: "www.baidu.com",
  success: function(){
    alert("成功");
  },
  error:function(){
    alert("失败");
  }
});
```

$.Deferred()写法（Promise）
```
$.ajax("test.html")
  .done(function(){ alert("成功"); })
  .fail(function(){ alert("失败"); });
```

$.Deferred()的骚操作（Promise.all）
```
$.when($.ajax("test.html"), $.ajax("abc.html"))
  .done(function(){ alert("成功"); })
  .fail(function(){ alert("失败"); });
  .done(function(){ alert("第二个回调函数");} );
```

和ES6的`Promise`很像有没有？（连resolve和reject都一样）

$.Deferred源码（精简版本）
```
$.Deferred = function() {
  var tuples = [
    [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
    [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
    [ "notify", "progress", jQuery.Callbacks("memory") ]
  ],

  state = "pending",

  then: function() {
    var fns = arguments;
    return jQuery.Deferred(function( newDefer ) {
      jQuery.each( tuples, function( i, tuple ) {
        var action = tuple[ 0 ],
          fn = fns[ i ];
        var returned = fn.apply( this, arguments );
        //如果回调返回的是一个Deferred实例
        if ( returned && jQuery.isFunction( returned.promise ) ) {
          //则继续派发事件
          returned.promise()
            .done( newDefer.resolve )
            .fail( newDefer.reject )
            .progress( newDefer.notify );
        } 
      }
    }
    fns = null;
  }
}
```

$.when的实现（精简版本）
```
  resolveValues = core_slice.call( arguments ),
  length = resolveValues.length,
  remaining = length

  if ( length > 1 ) {
    for(i=0;i < length; i++) {
      // 如果成功就 --remaining;
    }
  }
```

### [返回主页](/README.md)