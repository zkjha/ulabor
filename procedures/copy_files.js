/**
 * 移动文件到指定的版本目录。
 * 把static目录里面的所有文件复制到deploy文件下，文件名为（ Math.round(new Date().getTime() / 1000)）
 */

'use strict';

var config = require('../config.js'), ncp = require('ncp'), async = require('async'), fs = require('fs'), utils = require('../utils.js'), storage = require('../storage.js');
var cssDirName= config.cssDirName;
// 最新版本号
var distFolder = config.basePath + '/' + Math.round(new Date().getTime() / 1000);
storage.set('distfolder', distFolder);

var createDist = function(callback) {
  utils.log('创建目录' + distFolder);
  fs.mkdir(distFolder, callback);
};
var createCopy = function(callback) {
  utils.log('复制目录' + config.staticFolder + '到目标目录' + distFolder);
  ncp(config.staticFolder, distFolder, callback);
};



exports.run = function(callback) {
  utils.log('开始创建目录');
  async.series([ createDist, createCopy ], function(err, results) {
    utils.log('目录创建完成！\n');
    callback(err, results);
  });
};