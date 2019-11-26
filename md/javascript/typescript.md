# Typescript


### 在 `Ts/Tsx` 文件中引入 `js` 文件/库

需要在`.d.ts` 的声明文件中，然后用三斜线指令引入进来

以`create-react-app`为例：在`react-app-env.d.ts`文件中添加需要引入的 `.js`文件位置

```
    /// <reference types="react-scripts" />
    /// <reference path="./utils/throttle.js" />
```

三斜线指令中需要注意的是 path 类型和 types 类型的区别：
* `types` 类型声明的是对 `node_modules/@types` 文件夹下的类型的依赖，不包含路径信息
* `path` 类型声明的是对本地文件的依赖，包含路径信息