# Less

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
4. 变量
    ```
        @width: 10px;
        // 这边是 带单位的计算哦
        @height: @width + 10px;

        #header {
            width: @width;
            height: @height;
        }
    ```
5. 运算
    ```
        @incompatible-units: 2 + 5px - 3cm; // 结果是 4px
    ```
6. 特例
    ```
        // 为了与 CSS 保持兼容，calc() 并不对数学表达式进行计算，但是在嵌套函数中会计算变量和数学公式的值。

        @var: 50vh/2;
        width: calc(50% + (@var - 20px));  // result is calc(50% + (25vh - 20px))
    ```
7. 转义
    ```
    
        @min768: ~"(min-width: 768px)";
    ```
8. 混合
    ```
        .bordered {
            border-top: dotted 1px black;
            border-bottom: solid 2px black;
        }

        #menu a {
            color: #111;
            .bordered();
        }
    ```
9.  方法
    ```
        
        // 定义方法
        #greyGap(@h) {
            // 使用参数
            border-bottom: @h solid grey;
        }

        div {
            // 调用方法
            #greyGap(1px);
        }
    ```
10. 循环
    ```
        // 该案例中保护：Less循环、传参，值计算
        
        div {
            .cont(@i) when (@i > 0) {
                // css定义
                .abc:nth-of-type(@{i}) {
                    color: #333333;
                    animation: grow 1s ~'calc(@{i} * 0.15)s' ease-in-out infinite;
                }
                // 递归
                .cont((@i - 1));
            }
            // 调用
            .cont(4);
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
        div .abc:nth-of-type(1){
            animation: grow-data-v-68841034 1s 0.6s ease-in-out infinite;
        }
    ```

