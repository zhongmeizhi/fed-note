module.exports = {
  base: "/fed-note/",
  title: "Mokou的小书房",
  keys: "Mokou,源码解析,前端,Vue,Vue3,Es6,Javascript",
  description: "Mokou,源码解析,前端,Vue,Vue3,Es6,Javascript",
  themeConfig: {
    logo: '/mh.jpg',
    nav: [
        { text: '主页', link: '/' },
        { text: 'Github', link: 'https://github.com/zhongmeizhi' },
        // { text: '测试', link:'/css/mobile'}
    ],
    sidebar: [
      {
        title: '深入浅出 Vue3',   // 必要的
        children: [
          {
            title: 'vite篇',   // 必要的
            path: '/resource-analysis/vue3_vite',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'reactive篇',   // 必要的
            path: '/resource-analysis/vue3_reactive',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'effect篇',   // 必要的
            path: '/resource-analysis/vue3_effect',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '写一个简单的响应式vue',   // 必要的
            path: '/resource-analysis/vue3_reactive_summary',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'ref和computed',   // 必要的
            path: '/resource-analysis/vue3_computed',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
        ]
      },
      {
        title: 'Vue2 && React',   // 必要的
        children: [
          {
            title: 'Fiber 源码解析',   // 必要的
            path: '/resource-analysis/fiber',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'Vue 2.x 源码解析',   // 必要的
            path: '/resource-analysis/vue2',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'React 简况',   // 必要的
            path: '/mvvm/react',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'React Ref',   // 必要的
            path: '/mvvm/react-ref',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '翻译：React useEffect完全指南',   // 必要的
            path: '/mvvm/useEffect',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '翻译：React函数组件心智模型',   // 必要的
            path: '/mvvm/react_function_or_class',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
        ]
      },
      {
        title: '计算机基础',   // 必要的
        children: [
          {
            title: '前端安全性',   // 必要的
            path: '/browser/security_code',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '关于Http',   // 必要的
            path: '/browser/http',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '页面加载过程',   // 必要的
            path: '/browser/page_load',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '设计模式',   // 必要的
            path: '/sse/design_model',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
        ]
      },
      {
        title: '算法基础',   // 必要的
        children: [
          {
            title: '基本概念',   // 必要的
            path: '/algorithm/base',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
        ]
      },
      {
        title: '前端基础',   // 必要的
        children: [
          {
            title: '移动端-适配',   // 必要的
            path: '/css/mobile.md',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'PC端-布局',   // 必要的
            path: '/css/layout.md',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '性能优化',   // 必要的
            path: '/sse/optimization',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'async await',   // 必要的
            path: '/sse/async_await',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '模块化',   // 必要的
            path: '/sse/module',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '关于动画',   // 必要的
            path: '/javascript/animation',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '迭代器',   // 必要的
            path: '/javascript/iterator',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'JS运行机制',   // 必要的
            path: '/sse/event_loop',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'JS垃圾回收机制',   // 必要的
            path: '/browser/garbage_collection',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'CSS基础篇',   // 必要的
            path: '/review/css_base',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'JS数据类型篇',   // 必要的
            path: '/review/js_type',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'JS函数篇',   // 必要的
            path: '/review/js_function',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'Webpack篇',   // 必要的
            path: '/review/webpack',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
        ]
      },
      // {
      //   title: '前端进阶版',   // 必要的
      //   children: [
      //     {
      //       title: '执行上下文',   // 必要的
      //       path: '/advance/co_text.md',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
      //     },
      //   ]
      // },
      {
        title: '手写代码合集',   // 必要的
        children: [
          {
            title: '各种手写代码实现 ',   // 必要的
            path: '/review/js_code',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
        ]
      },
      {
        title: 'Flutter实战',   // 必要的
        children: [
          {
            title: '简介',   // 必要的
            path: '/flutter/BRIEF',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '屏幕适配',   // 必要的
            path: '/flutter/SCENES',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '渲染策略',   // 必要的
            path: '/flutter/PRIMER',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'WebView',   // 必要的
            path: '/flutter/webview',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '局部路由实现',   // 必要的
            path: '/flutter/navigator',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '环境问题汇总',   // 必要的
            path: '/flutter/SCENES',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '开发细节',   // 必要的
            path: '/flutter/ISSUE',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'API使用',   // 必要的
            path: 'https://github.com/zhongmeizhi/flutter-UI',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'WebView',   // 必要的
            path: 'https://github.com/zhongmeizhi/fultter-example-app',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
        ]
      },
      {
        title: '服务端相关',   // 必要的
        children: [
          {
            title: 'Java常识',   // 必要的
            path: '/java/begin',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '数据库相关',   // 必要的
            path: '/java/db',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'SpringBoot',   // 必要的
            path: '/java/spring_boot',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'NPM机制',   // 必要的
            path: '/node/NPM',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '用Koa2撸一个API Mock',   // 必要的
            path: 'https://github.com/zhongmeizhi/z-mock',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '用Koa2撸一个uuzpack',   // 必要的
            path: 'https://github.com/zhongmeizhi/uuz',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
        ]
      },
      {
        title: '简单的API',   // 必要的
        children: [
          {
            title: 'dart（一）概述',   // 必要的
            path: '/dart/PRIMER',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'dart（二）基本操作',   // 必要的
            path: '/dart/base',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'dart（三）类',   // 必要的
            path: '/dart/class',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'dart（四）稍微抽象点',   // 必要的
            path: '/dart/again',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'RXJS学习（一）函数式编程',   // 必要的
            path: '/sse/function_program',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'RXJS学习（二）Observable',   // 必要的
            path: '/rxjs/Observable',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'RXJS学习（三）Operators',   // 必要的
            path: '/rxjs/Operators',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'RXJS学习（四）Subject',   // 必要的
            path: '/rxjs/Subject',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'RXJS学习（五）Scheduler',   // 必要的
            path: '/rxjs/Scheduler',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
        ]
      },
      {
        title: '经验之谈',   // 必要的
        children: [
          {
            title: 'git命令',   // 必要的
            path: '/other/GIT',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'GitHub的Host和Key',   // 必要的
            path: '/other/GITHUB',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'Hybrid开发相关',   // 必要的
            path: '/javascript/hybrid',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'CSS 经验包',   // 必要的
            path: '/css/EXPERIENCE.md',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: 'JS 经验包',   // 必要的
            path: '/javascript/experience',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
          {
            title: '好用的新API',   // 必要的
            path: '/javascript/useful_features',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          },
        ]
      },
    ]
  },
}
