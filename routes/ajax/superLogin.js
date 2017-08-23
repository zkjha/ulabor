/**
 *.
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

//登陆
router.post("/",function(req, res, next){
    var session  = req.session;
    var form_data= securityUtil(req);


    var options = {
        form:form_data
    };
    request.post(remoteUrl.superAdminLogin,options, function (error, response, body) {
        console.log('zzz');
        if (!error) {

            try {
                var json_body = JSON.parse(body);
                console.log(json_body);
                var code = json_body.code;//获取返回码
                if(code==codeEnum.Ok){

                    var data=json_body.data;
                    session.api_session_id=data.session_id;
                    session.userInfo = data.userinfo;

                }

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


});


//手机登录
router.post("/phoneLogin",function(req, res, next){
    var session = req.session;
    var data = securityUtil(req);
    var options = {
        form:data,
    }
    request.post(remoteUrl.phoneLogin,options, function (error, response, body) {
        if (!error) {
            try {
                var json_body = JSON.parse(body);
                if(json_body.code == codeEnum.Ok){
                    session.api_session_id = json_body.data.session_id;
                    session.userInfo = json_body.data.userinfo;
                }
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


});



//登录发送短信验证码
router.post("/sendSmsVerifyCode",function(req, res, next){
    var strImgVerifyCode=req.body.strImgVerifyCode;
    var strImgVerifyCodeId=req.body.strImgVerifyCodeId;
    var strPhone =req.body.strPhone;
    var options = {
        form:{
            strImgVerifyCode:strImgVerifyCode,
            strImgVerifyCodeId:strImgVerifyCodeId,
            strPhone:strPhone
        },
        headers:{
            "access_token": storage.get("access_token")
        }
    };
    request.post(remoteUrl.sendSmsVerifyCode,options, function (error, response, body) {

        if (!error) {
            try {
                var json_body = JSON.parse(body);
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


});


router.post('/uploadfile', function(req, res){

    var files =req.files;

    var file =files.file;//注意 files.file 这里的file 必须和前端form表单的input 的name名字相同
    var filepath =file.path;
    var requestFileName="file";

    var boundaryKey=new Date().getTime();
    fs.readFile(filepath ,'binary',function (err, data) {
        var payload = '--' + boundaryKey + '\r\n'
            + 'Content-Type: '+file.type+'\r\n'
            + 'Content-Disposition: form-data; name="'+requestFileName+'"; filename="'+file.name+'"\r\n'
            + 'Content-Transfer-Encoding: binary\r\n\r\n';
        var enddata  = '\r\n--' + boundaryKey + '--\r\n';
        var senddata=payload+data+enddata;
        // senddata=new Buffer(senddata,'utf-8');
        var options = {
            body:new Buffer(senddata,'binary'),
            headers:{
                'Content-Type': 'multipart/form-data; boundary='+boundaryKey+''

            }
        };
        request.post("http://10.10.113.91:9204/v1/file/upload",options, function (error, response, body) {

            if (!error) {
                try {
                    var json_body = JSON.parse(body);
                    res.send(json_body);
                    // res.sendFile()
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

    });





});

module.exports = router;