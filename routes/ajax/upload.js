/**
 * Created by zkj .
 * 处理用户相关ajax请求
 */
var express = require('express');
var request = require('request');
var remoteUrl = require('../../util/RemoteUrl');
var storage = require('../../util/storage');
var codeEnum = require('../../util/codeEnum.js');
var securityUtil = require('../../util/SecurityUtil.js');
var fs = require('fs');
var router = express.Router();

//新增资源请求
router.post("/",function(req, res, next){
    var session=req.session;
    var file = req.files&&req.files.file;
    var path = file.path;
    var requestFileName="file";
    var boundaryKey=new Date().getTime();
    console.log(file);
    var options = {
        method: 'POST',
        url:remoteUrl.upload,
        headers:{
            'cache-control': 'no-cache',
            session_id: session.api_session_id,
            'content-type': 'multipart/form-data; boundary=----'+boundaryKey
        },
        formData: {
            file:{
                    value: fs.createReadStream(path),
                    options: {
                        filename: file.name,
                        contentType: file.type
                    }
            }
        }
    };
console.log(options);
    request(options, function (error, response, body) {
        if (error){
             res.send(err);
             return
        }else{
            try{
                var json_body = JSON.parse(body);
                console.log(json_body);
                res.send(json_body);
            }catch (err){
                console.log(err);
                res.send({"code":codeEnum.SYSTEM_ERROR,"msg":err.message});
            }
        }

    });



/*    fs.readFile(path,function (err,data) {
        if(err){
            res.end(err);
            return
        }
        var payload = '--' + boundaryKey + '\r\n'
            + 'Content-Type: '+file.type+'\r\n'
            + 'Content-Disposition: form-data; name="'+requestFileName+'"; filename="'+file.name +'"\r\n'
            + 'Content-Transfer-Encoding: binary\r\n\r\n';
        var enddata  = '\r\n--' + boundaryKey + '--\r\n';
        var senddata=payload+data+enddata;
        console.log(senddata);
        // senddata=new Buffer(senddata,'utf-8');
        var options = {
            body:new Buffer(senddata,'binary'),
            headers:{
                'Content-Type': 'multipart/form-data; boundary='+boundaryKey+'',
                session_id:session.api_session_id

            }
        };
        console.log(options);
        request.post(remoteUrl.upload,options, function (error, response, body) {
            if (!error) {
                try {
                    var json_body = JSON.parse(body);
                    console.log(json_body);
                    res.send(json_body);
                }
                catch (err) {
                    console.error(err);
                    res.send({"code":codeEnum.SYSTEM_ERROR,"msg":err.message});
                }


            }else{
                console.error(error);
                res.send({"code":codeEnum.SYSTEM_ERROR,"msg":error.message});
            }

        })
    });*/
});
//上传文件
router.post("/uploadFile",function(req, res, next){
    var session=req.session;
    var file = req.files&&req.files.file;
    var path = file.path;
    var requestFileName="file";
    var boundaryKey=new Date().getTime();
    console.log(file);
    var options = {
        method: 'POST',
        url:remoteUrl.uploadFile,
        headers:{
            'cache-control': 'no-cache',
            session_id: session.api_session_id,
            'content-type': 'multipart/form-data; boundary=----'+boundaryKey
        },
        formData: {
            file:{
                    value: fs.createReadStream(path),
                    options: {
                        filename: file.name,
                        contentType: file.type
                    }
            }
        }
    };
console.log(options);
    request(options, function (error, response, body) {
        if (error){
             res.send(err);
             return
        }else{
            try{
                var json_body = JSON.parse(body);
                console.log(json_body);
                res.send(json_body);
            }catch (err){
                console.log(err);
                res.send({"code":codeEnum.SYSTEM_ERROR,"msg":err.message});
            }
        }

    });



/*    fs.readFile(path,function (err,data) {
        if(err){
            res.end(err);
            return
        }
        var payload = '--' + boundaryKey + '\r\n'
            + 'Content-Type: '+file.type+'\r\n'
            + 'Content-Disposition: form-data; name="'+requestFileName+'"; filename="'+file.name +'"\r\n'
            + 'Content-Transfer-Encoding: binary\r\n\r\n';
        var enddata  = '\r\n--' + boundaryKey + '--\r\n';
        var senddata=payload+data+enddata;
        console.log(senddata);
        // senddata=new Buffer(senddata,'utf-8');
        var options = {
            body:new Buffer(senddata,'binary'),
            headers:{
                'Content-Type': 'multipart/form-data; boundary='+boundaryKey+'',
                session_id:session.api_session_id

            }
        };
        console.log(options);
        request.post(remoteUrl.upload,options, function (error, response, body) {
            if (!error) {
                try {
                    var json_body = JSON.parse(body);
                    console.log(json_body);
                    res.send(json_body);
                }
                catch (err) {
                    console.error(err);
                    res.send({"code":codeEnum.SYSTEM_ERROR,"msg":err.message});
                }


            }else{
                console.error(error);
                res.send({"code":codeEnum.SYSTEM_ERROR,"msg":error.message});
            }

        })
    });*/
});
module.exports = router;