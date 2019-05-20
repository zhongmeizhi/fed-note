# 注解

> @RestController

@RestController 的意思就是 Controller 里面的方法都以 json 格式输出，不用再写 jackjson 配置了。

> @Configuration

经常项目中会使用 filters 用于录调用日志、排除有 XSS 威胁的字符、执行权限验证等。

Spring Boot自动添加了OrderedCharacterEncodingFilter 和 HiddenHttpMethodFilter，并且我们可以自定义 Filter。

自定义Filter步骤
1. 实现 Filter 接口，重写方法
2. 添加@Configuration 注解，将自定义Filter加入过滤链

> @Value

在resource/application.properties文件中