require('colors');

var fs = require('fs-extra');
var path = require('path');
var mkdirp = require('mkdirp');
var spawn = require('child_process').spawn;
var gift = require('gift');


function clone(repo, dest) {
	return new Promise(function(resolve, reject){
		gift.clone(repo, dest, function(err, repo){
			if(err) reject(err);
			else resolve(repo);
		});
	});
}

function createBranch(repo, name) {
	return new Promise(function(resolve, reject){
		repo.create_branch(name, function(err){
			if(err) reject(err);
			else resolve();
		});
	});
}

function branches(repo) {
	return new Promise(function(resolve, reject){
		repo.branches(function(err, branches){
			if(err) reject(err);
			else resolve(branches);
		});
	});
}

function getCurrentBranch(repo) {
	return new Promise(function(resolve, reject){
		repo.branch(function(err, branch){
			if(err) reject(err);
			else resolve(branch);
		});
	});
}

function checkout(repo, name) {
	return new Promise(function (resolve, reject){
		repo.checkout(name, function(err){
			if(err) reject(err);
			else resolve();
		});
	});
}

function addAll(repo) {
	return new Promise(function (resolve, reject){
		repo.add('--all', function(err){
			if(err) reject(err);
			else resolve();
		});
	});
}

function commit(repo, message, options) {
	options = options || {};
	return new Promise(function (resolve, reject){
		repo.commit(message, options, function(err){
			if(err) reject(err);
			else resolve();
		});
	});
}

function push(repo, remote, branch) {
	 return new Promise(function (resolve, reject){
		repo.remote_push(remote, branch, function(err){
			if(err) reject(err);
			else resolve();
		});
	});
}



function run(command, args, options) {
  return new Promise(function(resolve, reject) {
    var task = spawn(command, args, options);
    task.on('close', function(code) {
      if (code !== 0) reject(new Error(command + ' process exited with code ' + code));
      else resolve();
    });
  });
}

function copy(src, dest) {
  return new Promise(function(resolve, reject) {
    fs.copy(src, dest, function(err) {
      if (err) reject(err);
      resolve();
    });
  });
}

function mkdir(p) {
  return new Promise(function(resolve, reject) {
    mkdirp(p, function(e) {
      if (e) reject(e);
      else resolve(p);
    });
  });
}


function mkdirs(pathes) {
  if (!Array.isArray(pathes))
    pathes = [pathes];
  return Promise.all(pathes.map(function(p) {
    return mkdir(p);
  }));
}

function createFile(fileName, data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(fileName, data, function(error) {
      if (error) reject(error);
      else resolve(fileName);
    });
  });
}

function walk(folder) {
  return new Promise(function(resolve, reject) {
    fs.readdir(folder, function(error, files) {
      if (error) return reject(error);
      Promise.all(files.map(function(name) {
        var p = path.join(folder, name);
        var stat = fs.statSync(p);
        if (stat && stat.isFile())
          return Promise.resolve({
            path: path.join(folder, name),
            folder: folder,
            name: name
          });
        else return walk(path.join(folder, name));
      })).then(function(files) {
        var result = [];
        files.forEach(function(file) {
          if (Array.isArray(file))
            result = result.concat(file);
          else result.push(file);
        });
        resolve(result.filter(function(file) {
          return /\.md$/.test(file.name);
        }));
      }).catch(reject);
    });
  });
}

function readDir(folder) {
  return new Promise(function(resolve, reject) {
    if (!fs.existsSync(folder)) reject(new Error(folder + '文件夹不存在'));
    var stat = fs.statSync(folder);
    if (!stat || !stat.isDirectory()) reject(new Error(folder + '不是一个文件夹'));

    Promise.resolve(folder).then(walk).then(resolve).catch(reject);
  });
}

function readFile(fileName) {
  return new Promise(function(resolve, reject) {
    fs.readFile(fileName, function(error, content) {
      if (error) reject(error);
      else resolve(content.toString('utf-8'));
    });
  });
}

module.exports = {
  mkdir: mkdir,
  mkdirs: mkdirs,
  createFile: createFile,
  readDir: readDir,
  readFile: readFile,
  copy: copy,
  run: run,
  clone: clone,
  branches: branches,
  getCurrentBranch: getCurrentBranch,
  checkout: checkout,
  addAll: addAll,
  commit: commit,
  push: push,
  createBranch: createBranch
};