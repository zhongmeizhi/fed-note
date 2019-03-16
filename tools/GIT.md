# git 使用

## 常用命令

* 克隆
> git clone http://xxx.git dirname

* 查看分支
> git branch [ -a | -r ]

* 查看状态
> git status

* 对比
> git diff

* 添加文件
> git add [ -a ]

* 拉取
> git fetch --all

> git pull origin name

* 提交代码
> git commit -m 'remark'

> git rebase

> git push origin name

> git merge

* 创建子分支
> git checkout -b name

* 删除本地分支
> git branch -d name

* 删除远程分支
> git push origin --delete name

* fork代码到本地
> fork remote add https://xxx.git

* 查看远程代码地址
> git remote -v

* 同步fork代码
1. > git fetch upstream
2. > git checkout master
3. > git merge upstream/master
4. > git push

## [返回主页](/README.md)