/**
 * Created by ZRL on 16/12/9.
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
router.post("/addResourse",function(req, res, next){
    var session=req.session;

    var form_data= securityUtil(req);


    var options = {
        form:form_data,
        headers:{
            "session_id":session.api_session_id
        }
    };
    console.log(options);
    request.post(remoteUrl.addResourse,options, function (error, response, body) {

        if (!error) {

            try {
                var json_body = JSON.parse(body);
                console.log(json_body);
                var code = json_body.code;//获取返回码
                if(code==codeEnum.Ok){

                    var data=json_body.data;

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


//资源列表管理
router.post("/resourseList",function(req, res, next){
    var session  =req.session;
    var data = securityUtil(req);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    request.post(remoteUrl.getResourseList,options, function (error, response, body) {
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


});

//资源列表获取
router.post("/addStorage",function(req, res, next){
    var session  =req.session;
    var data = securityUtil(req);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    request.post(remoteUrl.addStorage,options, function (error, response, body) {
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


});








module.exports = router;