# mysql 安装&&初始化

*安装的mysql版本为 5.7*

安装步骤
1. 官网下载 https://dev.mysql.com/downloads/file/?id=484900
2. 解压zip包 mysql-8.0.15-winx64
3. 配置path环境变量(到bin目录)
4. 默认解压后没有my.ini文件，故新增my.ini文件，内容如下
    ```
        [client]
        port=3306
        password=

        [mysql]
        default-character-set=gb2312
    ```
5.  以管理员身份(否则没权限)运行cmd，cd到解压目录mysql-8.0.15-winx64
6.  执行 **mysqld --initialize-insecure** 以初始化data文件夹
7.  执行 **mysqld --install** 安装mysql服务
8.  执行 **net start mysql** 启动mysql
9.  *mysql5.7默认有随机密码* 密码存放在 data目录下的 xxx.err文件内
    * 搜索password is generated for root@localhost:可以找到默认密码
10. 执行 **mysql -u root -p** 输入默认密码
11. 执行 **SET PASSWORD FOR 'root'@'localhost' = PASSWORD('');** 修改默认root密码为空

## 安装&&初始化完成
[返回主页](/README.md)
