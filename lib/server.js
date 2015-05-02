require('colors');
var koa = require('koa');
var serve = require('koa-static');
var argv = require('optimist').argv;
var exec = require('child_process').exec;
var port = argv.port;
var app = koa();

app.use(function * (next) {
	this.set('Access-Control-Allow-Origin', '*');
	yield next;
});

app.use(serve('.'));

app.listen(port, function() {
	open('http://127.0.0.1' + (port === 80 ? '' : (':' + port)) + '/index.html');
});

console.log(('Server started at http://127.0.0.1:' + port).green);

function open(url) {
	switch (process.platform) {
		case "darwin":
			exec('open ' + url);
			break;
		case "win32":
			exec('start ' + url);
			break;
		default:
			spawn('xdg-open', [url]);
	}
}