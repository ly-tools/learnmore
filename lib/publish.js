require('colors');

var util = require('./util');
var path = require('path');
var fs = require('fs-extra');
var gift = require('gift');
var CWD = process.cwd();

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = function() {
  var config = JSON.parse(fs.readFileSync(path.join(CWD, 'learnmore.json'), 'utf-8'));
  var git = config.git;
  if (!git) console.log('请在learnmore.json的git字段中配置git项目地址');
  var dest = path.join(getUserHome(), '.learnmore');
  var repo = null;
  var PUBLISH_BRANCH = 'gh-pages';

  Promise.resolve(dest)
    .then(function() {
      console.log('正在构建'.yellow);
      return util.run('lm', ['build'], {
        cwd: CWD
      });
    })
    .then(function() {
      var repo;
      if(!fs.existsSync(path.join(dest, '.git'))) {
        console.log(('正在克隆项目: git clone ' + git + ' ' + dest).yellow);
        return util.clone(git, dest); 
      }
      else return gift(dest);
    })
    .then(function(r) {
      repo = r;
      console.log('开始复制构建结果'.yellow);
      return util.copy(path.join(CWD, '__diary'), dest);
    })
    .then(function() {
      return util.getCurrentBranch(repo)
        .then(function(branch) {
          console.log('正在检查项目分支'.yellow);
          if (branch.name !== PUBLISH_BRANCH)
            return util.branches(repo)
              .then(function(branches) {
                return branches.filter(function(branch) {
                    return branch.name === PUBLISH_BRANCH;
                  }).length > 0;
              })
              .then(function(exists) {
                if (!exists) return util.createBranch(repo, PUBLISH_BRANCH);
                else return util.checkout(repo, PUBLISH_BRANCH);
              });
        });
    })
    .then(function() {
      console.log('缓存项目变更：git add --all'.yellow);
      return util.addAll(repo);
    })
    .then(function() {
      console.log('提交项目变更：git commit -m "learnmore publish"'.yellow);
      return util.commit(repo, 'learnmore publish');
    })
    .then(function() {
      console.log('推送项目到远程：git push origin gh-pages'.yellow);
      return util.push(repo, 'origin', PUBLISH_BRANCH);
    })
    .then(function() {
      console.log('发布完成'.green);
    })
    .catch(function(e) {
      console.log('发生错误：'.red + e.message.red);
      console.log(e.stack.red);
    });
};