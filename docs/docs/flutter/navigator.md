# Flutter 局部路由实现

Flutter是借鉴React的开发思想实现的，在子组件的插槽上，React有`this.props.children`，Vue有`<slot></slot>`。

当然Flutter也有类似的Widget，那就是`Navigator`，不过是以router的形式实现（像`<router-view></router-view>`？？？）。

**Navigator的使用无非3个属性**
* `initialRoute`: 初始路由
* `onGenerateRoute`: 匹配路由
* `onUnknownRoute`: 404

**在实现层面**

首先：Navigator的高度为infinity。如果直接父级非最上级也是infinity会产生异常，例如，Scaffold -> Column -> Navigator。所以：Navigator需要附件限制高度，例如：Scaffold -> Column -> Container（height: 300） -> Navigator


然后：在onGenerateRoute属性中，使用第一个BuildContext参数，能够在MaterialApp未设置route的情况下使用`Navigator.pushNamed(nContext, '/efg');`跳到对应的子路由中。


最后：Navigator执行寻找路由顺序是 initialRoute -> onGenerateRoute -> onUnknownRoute，这个和React的Route是类似的。


**最后附上源码**

```
import 'package:flutter/material.dart';

class NavigatorPage extends StatefulWidget {
  @override
  _NavigatorPageState createState() => _NavigatorPageState();
}

class _NavigatorPageState extends State<NavigatorPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Navigator'),
      ),
      body: Column(
        children: <Widget>[
          Text('Navigator的高度为infinity'),
          Text('如果直接父级非最上级也是infinity会产生异常'),
          Container(
            height: 333,
            color: Colors.amber.withAlpha(111),
            child: Navigator( // Navigator
              initialRoute: '/abc',
              onGenerateRoute: (val) {
                RoutePageBuilder builder;
                switch (val.name) {
                  case '/abc':
                    builder = (BuildContext nContext, Animation<double> animation, Animation<double> secondaryAnimation) => Column(
                      // 并没有在 MaterialApp 中设定 /efg 路由
                      // 因为Navigator的特性 使用nContext 可以跳转 /efg
                      children: <Widget>[
                        Text('呵呵呵'),
                        RaisedButton(
                          child: Text('去 /efg'),
                          onPressed: () {
                            Navigator.pushNamed(nContext, '/efg');
                          },
                        )
                      ],
                    );
                  break;
                  case '/efg':
                    builder = (BuildContext nContext, Animation<double> animation, Animation<double> secondaryAnimation) => Row(
                      children: <Widget>[
                        RaisedButton(
                          child: Text('去 /hhh'),
                          onPressed: () {
                            Navigator.pushNamed(nContext, '/hhh');
                          },
                        )
                      ],
                    );
                  break;
                  default:
                    builder = (BuildContext nContext, Animation<double> animation, Animation<double> secondaryAnimation) => Center(
                      child: RaisedButton(
                        child: Text('去 /abc'),
                        onPressed: () {
                          Navigator.pushNamed(nContext, '/abc');
                        },
                      )
                    );
                }
                return PageRouteBuilder(
                  pageBuilder: builder,
                  // transitionDuration: const Duration(milliseconds: 0),
                );
              },
              onUnknownRoute: (val) {
                print(val);
              },
              observers: <NavigatorObserver>[]
            ),
          ),
          Text('Navigator执行寻找路由顺序'),
          Text('initialRoute'),
          Text('onGenerateRoute'),
          Text('onUnknownRoute'),
        ],
      ),
    );
  }
}
```