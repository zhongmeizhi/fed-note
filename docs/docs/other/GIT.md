# git 使用

Git是分布式版本控制系统

### 常用命令

代码暂存
* 代码暂存`git stash save 'message'`
* 恢复最新的进度到工作区`git stash pop [–index] [stash_id]`
* 删除所有存储的进度`git stash clear`

克隆 `git clone http://xxx.git dirname`

fork代码到本地 `fork remote add https://xxx.git`

添加文件 `git add [ -a ]`

查看
* 查看分支 `git branch [ -a | -r ]`
* 查看状态 `git status`
* 查看远程代码地址 `git remote -v`
* 对比 `git diff`

拉取
* 拉取远程代码 `git fetch [ --all ]`
* 拉取远程代码并合并 `git pull origin name`

提交代码
  * 提交到本地 `git commit -m 'remark'`
  * 整理commit记录 `git rebase branch`
  * 提交到远程 `git push origin name`
  * 合并分支 `git merge branch`

创建子分支 `git checkout -b name`

删除分支
* 删除本地分支 `git branch -d name`
* 删除远程分支 `git push origin --delete name`
* 删除本地可见但远程已经删除的分支 `git remote prune origin`


同步fork代码
  1. `git fetch upstream`
  2. `git checkout master`
  3. `git merge upstream/master`
  4. `git push`

回撤提交 `git revert HEAD`

回滚到特定版本 
* `git reset --hard 5dc29bebe8`
  * 有多个选项[soft、mixed、hard]
  * hard = mixed + revert
* 回滚完成后只是在本地reset，需要覆盖远程节点
* `git push --force` 强制push

修补commit（用于代码提交错分支的情况）
* 生成最近的4次（^数量）commit的patch `git format-patch HEAD^^^^`
* 检查patch：如果没有任何输出，则说明无冲突`git apply --check 某提交.patch`
* 将名字为 "某提交.patch" 的patch打上`git am 某提交.patch`

