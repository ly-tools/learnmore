require('colors');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var path = require('path');
var fs = require('fs-extra');
var markdown = require('markdown-it')()
  .use(require('markdown-it-checkbox'));

var util = require('./util');
var CWD = process.cwd();

var template = _.template(fs.readFileSync(path.join(__dirname, '../assets','index.html'), 'utf-8'));

var calendar = {};

function markCalendar(year, month, day) {
  calendar[year] = calendar[year] || {};
  calendar[year][month] = calendar[year][month] || {};
  calendar[year][month][day] = 1;
}

function createIndex(dest) {
  return util.createFile(dest, template(JSON.parse(fs.readFileSync(path.join(CWD, 'learnmore.json'), 'utf-8'))), 'utf-8');
}

module.exports = function(dest) {
  console.log('开始构建'.green);
  dest = path.join(CWD, '__diary');
  Promise
    .resolve(dest)
    .then(util.mkdir)
    .then(function() {
      return util.readDir(path.join(CWD, 'source'));
    })
    .then(function(files) {
      return Promise.all(files.map(function(file) {
        console.log(('building: ' + file.path).green);
        return util.readFile(file.path).then(
          function(content) {
            var fileName = file.name.replace(/\.md/, '');
            markCalendar.apply(null, fileName.split('-'));
            return util.createFile(path.join(dest, fileName + '.html'), markdown.render(content));
          });
      }));
    })
    .then(function() {
      fs.writeFileSync(path.join(dest, 'cal.json'), JSON.stringify(calendar), 'utf-8');
      console.log('日记编译完成'.green);
      console.log('开始创建资源文件'.green);
      createIndex(path.join(dest, 'index.html'));
      return util.copy(path.join(__dirname, '../assets', 'static'), path.join(dest, 'static'));
    })
    .then(function(){
      console.log('创建资源文件创建完成'.green);
    })
    .catch(function(error) {
      console.log(error.stack);
      console.log(error.message.red);
    });
};