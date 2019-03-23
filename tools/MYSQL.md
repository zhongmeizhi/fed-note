# mysql 安装&&初始化

*安装的mysql版本为 5.7*

安装步骤
1. 官网下载 https://dev.mysql.com/downloads/file/?id=484900
2. 解压zip包 mysql-8.0.15-winx64
3. 配置path环境变量(到bin目录)
4. 默认解压后没有my.ini文件，故新增my.ini文件，内容如下
    ```
        [mysql]
        # 设置mysql客户端默认字符集
        default-character-set=utf8
        [mysqld]
        #设置3306端口
        port = 3306
        # 设置mysql的安装目录
        basedir=D:\\soft\\mysql-5.7.25-winx64
        # 允许最大连接数
        max_connections=200
        # 服务端使用的字符集默认为8比特编码的latin1字符集
        character-set-server=utf8
        # 创建新表时将使用的默认存储引擎
        default-storage-engine=INNODB
    ```
5.  以管理员身份(否则没权限)运行cmd，cd到解压目录mysql-8.0.15-winx64
6.  执行 **mysqld --initialize-insecure** 以初始化data文件夹
7.  执行 **mysqld --install** 安装mysql服务
8.  执行 **net start mysql** 启动mysql
9.  *mysql5.7默认有随机密码* 密码存放在 data目录下的 xxx.err文件内
    * 搜索password is generated for root@localhost:可以找到默认密码
10. 执行 **mysql -u root -p** 输入默认密码
11. 执行 **SET PASSWORD FOR 'root'@'localhost' = PASSWORD('');** 修改默认root密码为空

## End
> 文章分享同步于： https://github.com/zhongmeizhi/gitbook-FED
### [返回主页](/README.md)
