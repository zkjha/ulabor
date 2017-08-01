/**
 * 对前端工程中的css，js文件进行混淆，压缩和归并等等操作。
 * 
 */

'use strict';

var storage = require('../storage.js'), utils = require('../utils.js'), uglifyjs = require('uglify-js'), cleancss = require('clean-css'), fs = require('fs');
var requirejs = require('requirejs');
// 目标静态文件所在的临时目录
var path = storage.get('distfolder');

// 进行文件的压缩和混淆
var compress = function(path, ext,callback) {
  if (ext == 'css') {

     var originalContent = fs.readFileSync(path, 'utf-8').toString();

      try {
          requirejs.optimize({
              'optimizeCss' : 'standard',
              'cssIn' : path,
              'out' : path
          });
      } catch (e) {
          callback(e)
      }

  } else {
     // utils.log('js开始压缩当前路径＝＝＝＝＝！'+path);
    var targetContent = uglifyjs.minify(path, {
      mangle : true,
      compress:true,
        drop_console:true
      // warnings : true
    }).code;
      //utils.log('js开始压缩当前路径＝＝＝＝＝！'+targetContent);
    fs.writeFileSync(path, targetContent);
  }
};

var walkFiles = function(path,callback) {
  var filesList = fs.readdirSync(path);
  filesList.forEach(function(currentFile) {
    var tPath = path + '/' + currentFile;
    if (fs.statSync(tPath).isDirectory()) {
      walkFiles(tPath);
    } else {

      // 判断如果是js或者css文件，则进行压缩，否则不作处理
      var suffixExpress = /\.([^\.]+)$/;
      var results = suffixExpress.exec(tPath);
      var ext;
      try {
        ext = results[1];
      } catch (e) {
        ;
      }
      if (ext == 'css' || ext == 'js') {
        compress(tPath, ext,callback);
      }
    }
  });
};

exports.run = function(callback) {
  try {
    utils.log('开始压缩当前目录的静态文件！');
    utils.log('处理中，请稍后...');
    walkFiles(path,callback);
    utils.log('静态文件压缩成功！\n');
    callback();
  } catch (e) {
    callback(e);
  }
};