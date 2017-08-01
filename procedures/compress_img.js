/**
 * Created by liupengyan on 16/12/13.
 */



var imgMinifier = require('node-smushit'),utils = require('../utils.js'), config = require('../config.js'), storage = require('../storage.js');
var imgDirName= config.imgDirName;
var distfolder = storage.get('distfolder');


var compress_img=function(imageDir,callback){

    imgMinifier.smushit(imageDir, {
        onItemStart: function(item){

        },
        onItemComplete: function(e, item, response){
            utils.log('正在压缩图片...');

        },
        onComplete: function(reports){

            callback();
        },recursive: true}); //递归

};

exports.run = function(callback) {
    utils.log('准备压缩图片文件！');
    utils.log('请稍后...');
    try {
        utils.log('开始压缩图片文件！');
        compress_img(distfolder + imgDirName,function(e){
            callback();

        });
        utils.log('压缩图片文件处理完成！\n');

    } catch (e) {
        callback(e);
    }
};
