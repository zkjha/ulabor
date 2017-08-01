/**
 * 改变freemarker文件中所有静态资源的版本号。
 *
 */

'use strict';

var fs = require('fs'), async = require('async'), config = require('../config.js'), storage = require('../storage.js'), utils = require('../utils.js');

var version = storage.get('version');
var versionExpression2 = /"(\/static)(\/[a-zA-Z_0-9]+)?"/ig;
var versionExpression = /"version="[a-zA-Z_0-9]?""/ig;
var changeVersion = function(path) {
    utils.log('path==>' + path);
    var originalContent = fs.readFileSync(path).toString();

    var hasChanged = false;
    //$0表示匹配到的字符，$1 表示匹配到的字符串RegExp.input（括号里面）,$2,表示匹配到的字符的最小索引位置(RegExp.index)



        var changedContent = originalContent.replace(versionExpression, function($0, $1, $2) {

            utils.log('需要修改版本号的的URL' + $0);
            utils.log('匹配到的字符串' + $1);
            var target = 'version="' + version  + '"';
            hasChanged = true;
            utils.log('替换成的目标URL' + target);
            return target;
        });
    utils.log('changedContent===>' + changedContent);

    if (hasChanged) {
        utils.log('修改目标文件' + path);
        //fs.write

        fs.writeFileSync(path, changedContent);
    }

};

var walkFiles = function(path, callback) {

        changeVersion(path);
        callback();

};

exports.run = function(callback) {
    try {
        utils.log('开始修改目录版本号'+ config.freemarkerFolder);
        walkFiles(config.freemarkerFolder, callback);
        utils.log('目录版本号修改完成！\n');
        callback();
    } catch (e) {

        callback(e);
    }
};