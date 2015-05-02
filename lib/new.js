require('colors');

var path = require('path');
var multiline = require('multiline');
var _ = require('lodash');
var util = require('./util');
var CWD = process.cwd();

var template = _.template('<%= year %>年<%= month %>月<%= day %>日\n=========\n\n你的日记正文');

module.exports = function(date) {
	Promise
		.resolve(date)
		.then(function parseDate(date) {
			return new Promise(function(resolve, reject) {
				var rst = [];
				if (!date) {
					var now = new Date();
					rst = {
						year: now.getFullYear(),
						month: now.getMonth() + 1,
						day: now.getDate()
					};
					return resolve(rst);
				}
				if (date.indexOf('-') !== -1)
					rst = date.split('-');
				else if (date.indexOf('/') !== -1)
					rst = date.split('/');
				else if (date.indexOf('.') !== -1)
					rst = date.split('.');

				try {
					rst = rst.map(function(it) {
						return parseInt(it);
					});
				} catch (e) {
					reject(e);
				}
				resolve({
					year: rst[0],
					month: rst[1],
					day: rst[2]
				});
			});
		})
		.then(function (date) {
			console.log(('开始创建' + date.year + '年' + date.month + '月' + date.day +
				'日的日记').green);
			var fileName = path.join(CWD, 'source', date.year + '-' + date.month + '-' +
				date.day + '.md');
			return util.createFile(fileName, template(date));
		})
		.then(function() {
			console.log('日记创建完成'.green);
		})
		.catch(function(error) {
			console.log(error.message.red);
		});
};
