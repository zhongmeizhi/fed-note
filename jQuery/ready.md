# ready

### onDOMContentLoaded
* 当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完成加载。
* DOMContentLoaded 事件必须等待其所属script之前的样式表加载解析完成才会触发。
* 兼容到IE9
* 使用方法`document.removeEventListener( "DOMContentLoaded", fn );`

### document.readyState的三种状态
* loading: document 仍在加载
* interactive: 文档已经完成加载，文档已被解析，但是诸如图像，样式表和框架之类的子资源仍在加载。
* complete: 文档和所有子资源已完成加载。状态表示 load 事件即将被触发
```
document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'interactive') {
    initLoader();
  }
  else if (event.target.readyState === 'complete') {
    initApp();
  }
});
```

...这让人想起了XMLHttpRequest
```
xhr.onreadystatechange = function () {
  if(xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};
```

在Chrome 73版本中 DOMContentLoaded 先于 interactive

## 新版本(2019-05-17)源码
```
// 导入jQuery的其他部分
define( [
	"../core",
	"../var/document",
	"../core/readyException",
	"../deferred"
], function( jQuery, document ) {

"use strict";

var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {
	readyList
		.then( fn )
		.catch( function( error ) {
			jQuery.readyException( error );
		} );
	return this;
};

jQuery.extend( {

	isReady: false,
	readyWait: 1,

	ready: function( wait ) {

		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		jQuery.isReady = true;

		//如果正常的DOM Ready事件被触发则减少
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// 执行绑定的函数
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

function completed() {

  // 自清理方法
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );

	jQuery.ready();
}

// 重点
if ( document.readyState !== "loading" ) {

	// 异步处理
	window.setTimeout( jQuery.ready );

} else {

	document.addEventListener( "DOMContentLoaded", completed );

	window.addEventListener( "load", completed );
}

} );

```