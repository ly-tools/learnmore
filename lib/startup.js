require('colors');
var util = require('./util');
var path = require('path');
var CWD = process.cwd();

module.exports = function(port) {
	var args = ['--harmony', path.join(__dirname, 'server.js'), '--port', port || 4000];

	util
		.run('lm', ['build'], {
	    cwd: CWD
	  })
	  .then(function(){
	  	return util.run('node', args, {
				env: process.env,
				cwd: path.join(CWD, '__diary'),
				stdio: [
					process.stdin,
					process.stdout,
					process.stderr,
				]
			});
	  })
		.then(function(code){
			process.exit(code);
		})
		.catch(function(e){
			console.log(e.message.red);
			console.log(e.stack.red);
		});
};