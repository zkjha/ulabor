/**
 * Created by ZRL on 16/12/9.
 * 处理用户相关ajax请求
 */
var express = require('express');
var request = require('request');
var http = require("http");
var remoteUrl = require('../../util/RemoteUrl');
var storage = require('../../util/storage');
var codeEnum = require('../../util/codeEnum.js');
var securityUtil = require('../../util/SecurityUtil.js');
var staticValue = require('../../util/staticValue');
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
    console.log(remoteUrl.getResourseList);
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
//资源详情数据获取
router.post("/getResourseById",function(req, res, next){
    var session  =req.session;
    var data = securityUtil(req);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    console.log(remoteUrl.getResourseById);
    request.post(remoteUrl.getResourseById,options, function (error, response, body) {
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

//修改资源详情
router.post("/changeDetail",function(req, res, next){
    var session  =req.session;
    var data = securityUtil(req);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    console.log(remoteUrl.getResourseById);
    request.post(remoteUrl.changeDetail,options, function (error, response, body) {
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
    console.log(data);
    var options = {
        form: data,
        headers: {
            session_id: session.api_session_id
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

//获取指定资源的入库列表
router.post("/getStorageList",function(req, res, next){
    var session  =req.session;
    var data = securityUtil(req);
    console.log(data);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    request.post(remoteUrl.storageList,options, function (error, response, body) {
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

//pi设置资源是否可以共享
router.post("/piShareResource",function(req, res, next){
    var session  =req.session;
    var data = securityUtil(req);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    console.log(options);
    request.post(remoteUrl.setResourceSharing,options, function (error, response, body) {
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


//管理员取消共享资源
router.post("/cancelShare",function(req, res, next){
    var session  =req.session;
    var data = securityUtil(req);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    console.log(options);
    request.post(remoteUrl.cancelShare,options, function (error, response, body) {
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
//获取分组
router.post("/getGroups",function(req, res, next){
    var session  =req.session;
    var data = securityUtil(req);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    console.log(options);
    request.post(remoteUrl.getGroups,options, function (error, response, body) {
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
//共享设置
router.post("/managerSettingShare",function(req, res, next){
    var session  =req.session;
    var data = securityUtil(req);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    console.log(options);
    request.post(remoteUrl.setShare,options, function (error, response, body) {
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
//获取单条资源信息
router.post("/getDateByStrResourcesId",function(req, res, next){
    var session  =req.session;
    var data = securityUtil(req);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    console.log(options);
    request.post(remoteUrl.getDataById,options, function (error, response, body) {
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


//批量下载二维码
router.get("/domnloadQrCode",function(req, res, next){
    var session  =req.session;
    var strType = req.query.strType;
    // var data = securityUtil(req);
    // var option={
    //     strType:1
    // }
    var options = {
        method:'GET',
        hostname:staticValue.hostname,
        port:staticValue.port,
        path:staticValue.rootPath+remoteUrl.domnLoad+'?strType='+strType,
        // url:remoteUrl.domnLoad,
        headers:{
            session_id:session.api_session_id
        }

    };
    http.get(options, function ( response) {
        //console.log(response)
        try {
            response.setEncoding("binary");
            var data = "";
            response.on("data", function (chunk) {
                data += chunk;
            });
            response.on("end", function () {

                res.writeHead(response.statusCode,"200",response.headers);
                res.end(data,"binary");

            });
            response.on("error", function (err) {
                console.error(err);
                res.send({"code":codeEnum.SYSTEM_ERROR,"msg":err.message});
            });

        }
        catch (err) {
            console.error(err);
            res.send({"code":codeEnum.SYSTEM_ERROR,"msg":err.message});
        }

    });
});


//下载单条资源二维码
router.get("/downloadById",function(req, res, next){
    var session  =req.session;
    var strResourcesId = req.query.strResourcesId;
    console.log(staticValue.rootPath+''+remoteUrl.qrCodeById+'?strResourcesId='+strResourcesId);
    var options = {
        method:'GET',
        hostname:staticValue.hostname,
        port:staticValue.port,
        path:staticValue.rootPath+''+remoteUrl.qrCodeById+'?strResourcesId='+strResourcesId,
        // url:remoteUrl.domnLoad,
        headers:{
            session_id:session.api_session_id
        }

    };
    http.get(options, function ( response) {
        //console.log(response)
        try {
            response.setEncoding("binary");
            var data = "";
            response.on("data", function (chunk) {
                data += chunk;
            });
            response.on("end", function () {

                res.writeHead(response.statusCode,"200",response.headers);
                res.end(data,"binary");

            });
            response.on("error", function (err) {
                console.error(err);
                res.send({"code":codeEnum.SYSTEM_ERROR,"msg":err.message});
            });

        }
        catch (err) {
            console.error(err);
            res.send({"code":codeEnum.SYSTEM_ERROR,"msg":err.message});
        }

    });
});








module.exports = router;