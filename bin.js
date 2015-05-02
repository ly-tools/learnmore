#!/usr/bin/env node

require('colors');
var program = require('commander');
var multiline = require('multiline');
var pkg = require('./package.json');
var init = require('./lib/init');
var newPost = require('./lib/new');
var build = require('./lib/build');
var publish = require('./lib/publish');
var startup = require('./lib/startup');

program
  .version(pkg.version)
  .usage(multiline(function() {
    /*
    [command] [options]
		*/
  }));

program
  .command('init')
  .usage(multiline(function() {
    /*
		在当前文件夹下生成日记框架，日记写在source中

    example：

    $lm init

		*/
  }))
  .description('在当前文件夹下生成日记框架，日记写在source中')
  .action(function(env, options) {
    init();
  });

program
  .command('new')
  .usage(multiline(function() {
    /*
			在source下生成新的日记，默认生成当日日记，可使用"-d"或"--date"来指定生成的日记日期，日期格式可以为 YYYY/MM/DD 、 YYYY.MM.DD 、 YYYY-MM-DD

	    example：

	    $lm new

			or

			$lm new -d 2015/5/1
			$lm new --date 2015/5/1

			*/
  }))
  .description('在当前文件夹下生成日记框架，日记写在source中')
  .option('-d --date <s>', '需要生成日记的日期')
  .action(function(props) {
    newPost(props.date);
  });

program
  .command('build')
  .usage(multiline(function() {
    /*
    构建日记，构建结果所在的文件夹名称可以通过"-d"或"--dest"参数指定，默认为"__diary"

    example：

    $lm build

		*/
  }))
  .description('构建日记，构建结果所在的文件夹名称为"__diary"')
  .action(function(props) {
    build();
  });

program
  .command('build')
  .usage(multiline(function() {
    /*
    构建日记，构建结果所在的文件夹为"__diary"

    example：

    $lm build

    */
  }))
  .description('构建日记，构建结果所在的文件夹为"__diary"')
  .action(function(props) {
    build(props.dest);
  });


program
  .command('publish')
  .usage(multiline(function() {
    /*
    发布日记到learnmore.json中git字段指定的仓库中

    $lm publish

    */
  }))
  .description('发布日记到learnmore.json中git字段指定的仓库中')
  .action(function(props) {
    publish();
  });

program
  .command('server')
  .usage(multiline(function() {
    /*
    快速启动本地服务器查看构建效果，默认端口为4000，可以通过-p或者--port指定

    $lm server

    or

    $lm server -p 4000
    $lm server --port 4000

    */
  }))
  .description('快速启动本地服务器查看构建效果，默认端口为4000，可以通过-p或者--port指定')
  .option('-p --port <n>', '本地服务器占用的端口')
  .action(function(props) {
    startup(props.port);
  });

program.parse(process.argv);
