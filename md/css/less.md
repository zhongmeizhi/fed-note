# Less & Sass 使用

## Less
本质上，LESS 包含一套自定义的语法及一个解析器，用户根据这些语法定义自己的样式规则，这些规则最终会通过解析器，编译生成对应的 CSS 文件。LESS 并没有裁剪 CSS 原有的特性，更不是用来取代 CSS 的，而是在现有 CSS 语法的基础上，为 CSS 加入程序式语言的特性。

编译原理无非是AST（抽象语法树）。

简单Copy一下API。（挑选最常用的）

1. 嵌套
    ```
        #header {
        color: black;
            .navigation {
                font-size: 12px;
            }
            .logo {
                width: 300px;
            }
        }
    ```
2. 父选择器
    ```
        // & 代表嵌套的上级标签（父选择器）

        .grand {
            .parent {
                & > & {
                color: red;
                }

                & & {
                color: green;
                }

                && {
                color: blue;
                }

                &, &ish {
                color: cyan;
                }
            }
        }
        
        // 编译成
        .grand .parent > .grand .parent {
            color: red;
        }
        .grand .parent .grand .parent {
            color: green;
        }
        .grand .parent.grand .parent {
            color: blue;
        }
        .grand .parent, .grand .parentish {
            color: cyan;
        }
    ```
3. 继承
    ```
        nav ul {
            &:extend(.inline);
            background: blue;
        }
        .inline {
            color: red;
        }

        // 编译成
        nav ul {
            background: blue;
        }
        .inline, nav ul {
            color: red;
        }
    ```
4. 变量 & 运算
    ```
        @width: 10px;
        // 这边是 带单位的计算哦
        @height: @width + 10px;

        #header {
            width: @width;
            height: @height;
        }
    ```
5. 特例
    ```
        // 为了与 CSS 保持兼容，calc() 并不对数学表达式进行计算，但是在嵌套函数中会计算变量和数学公式的值。

        @var: 50vh/2;
        width: calc(50% + (@var - 20px));  // result is calc(50% + (25vh - 20px))
    ```
6. 转义
    ```
        @min768: ~"(min-width: 768px)";
    ```
7. 混合
    ```
        .bordered {
            border-bottom: solid 2px black;
        }

        #menu a {
            .bordered();
        }
    ```
8.  方法/函数
    ```
        // 定义方法
        #greyGap(@h) {
            border-bottom: @h solid grey;  // 使用参数
        }

        div {
            #greyGap(1px); // 调用方法
        }
    ```
9. 循环
    ```
        div {
            .cont(@i) when (@i > 0) {
                .abc:nth-of-type(@{i}) {
                    color: #333333;
                    animation: grow 1s ~'calc(@{i} * 0.15)s' ease-in-out infinite;
                }
                .cont((@i - 1)); // 递归
            }
            .cont(3); // 调用
        }

        // 会被编译成
        div .abc:nth-of-type(1){
            animation: grow-data-v-68841034 1s 0.15s ease-in-out infinite;
        }
        div .abc:nth-of-type(1){
            animation: grow-data-v-68841034 1s 0.3s ease-in-out infinite;
        }
        div .abc:nth-of-type(1){
            animation: grow-data-v-68841034 1s 0.45s ease-in-out infinite;
        }
    ```

# Sass

大部分都和 Less 差不多了。主要的不同如下：

1. 定义变量
    ```
        /* 标准蓝色 */
        $primaryColor: #108ee9;

        // 使用
        .abc {
            background: $primaryColor; 
        }
    ```
2. 混合
    ```
        // 底部0.5px的线
        @mixin line-bottom {
            position: relative;
            &::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 1px;
                background: $grey;
                transform: scaleY(0.5);
                bottom: 0;
                left: 0;
            }
        }

        // 使用
        .abc {
            @include line-bottom;
        }
    ```
3. 方法/函数
   ```
        $grid-width: 40px;
        $gutter-width: 10px;

        // 定义函数
        @function grid-width($n) {
            // 5 * 40px + 4 * 10px = 240px;
            @return $n * $grid-width + ($n - 1) * $gutter-width;
        }

        #sidebar { width: grid-width(5); }

        // 编译为 240px
        #sidebar { width: 240px; }
   ```
4. 循环 for in
    ```
        // 类似于 for in 循环
        @each $animal in puma, sea-slug, egret {
            .#{$animal}-icon {
                background-image: url('/images/#{$animal}.png');
            }
        }

        // 编译为
        .puma-icon {
            background-image: url('/images/puma.png');
        }
        .sea-slug-icon {
            background-image: url('/images/sea-slug.png');
        }
        .egret-icon {
            background-image: url('/images/egret.png');
        }

        // 多个值循环
        @each $animal, $color, $cursor in (puma, black, default),
                                  (sea-slug, blue, pointer),
                                  (egret, white, move) {
            .#{$animal}-icon {
                background-image: url('/images/#{$animal}.png'); // 使用第一个参数
                border: 2px solid $color; // 第二个参数
                cursor: $cursor; // 第三个参数
            }
        }
    ```
5. 循环 while do
    ```
        $i: 6;
        @while $i > 0 { 
            .item-#{$i} { width: 2em * $i; }
            $i: $i - 2;  // do
        }
    ```