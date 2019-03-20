# git 使用

Git是分布式版本控制系统

## 常用命令
* 克隆 `git clone http://xxx.git dirname`

* 查看分支 `git branch [ -a | -r ]`

* 查看状态 `git status`

* 对比 `git diff`

* 添加文件 `git add [ -a ]`

* 拉取远程代码 `git fetch [ --all ]`

* 拉取远程代码并合并 `git pull origin name`

* 提交代码
  * 提交到本地 `git commit -m 'remark'`
  * 整理commit记录 `git rebase branch`
  * 提交到远程 `git push origin name`
  * 合并分支 `git merge branch`

* 创建子分支 `git checkout -b name`

* 删除本地分支 `git branch -d name`

* 删除远程分支 `git push origin --delete name`

* fork代码到本地 `fork remote add https://xxx.git`

* 查看远程代码地址 `git remote -v`

* 同步fork代码
  1. `git fetch upstream`
  2. `git checkout master`
  3. `git merge upstream/master`
  4. `git push`

* 回撤 `git revert HEAD`

* 回滚到特定版本 `git reset --hard 5dc29bebe8`

## End
> 文章分享同步于： https://github.com/zhongmeizhi/gitbook-FED
## [返回主页](/README.md)