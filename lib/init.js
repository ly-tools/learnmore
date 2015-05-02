require('colors');
var path = require('path');
var util = require('./util');
var CWD = process.cwd();


module.exports = function() {
  console.log(('开始在 ' + CWD + ' 初始化日记仓库').green);
  util
	  .mkdirs(path.join(CWD, 'source'))
	  .then(function(){
	  	return util.copy(path.join(__dirname, '../assets', 'init.json'), path.join(CWD, 'learnmore.json'));	
	  })
	  .then(function(){
	  	console.info('日记仓库初始化完成'.green);
	  });
};
