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

//我的借出列表获取
router.post("/lendList",function(req, res, next){
    var session=req.session;
    var userInfo = session.userInfo;

    var form_data= securityUtil(req);


    var options = {
        form:form_data,
        headers:{
            "session_id":session.api_session_id
        }
    };
    console.log(options);
    request.post(remoteUrl.myLend,options, function (error, response, body) {

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

//确认收货
router.post("/receipt",function(req, res, next){
    var session=req.session;

    var form_data= securityUtil(req);


    var options = {
        form:form_data,
        headers:{
            "session_id":session.api_session_id
        }
    };
    console.log(options);
    request.post(remoteUrl.receipt,options, function (error, response, body) {

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

//加载单条数据信息
router.post("/lendDetail",function(req, res, next){
    var session=req.session;

    var form_data= securityUtil(req);


    var options = {
        form:form_data,
        headers:{
            "session_id":session.api_session_id
        }
    };
    console.log(options);
    console.log(remoteUrl.lendDetailInfo)
    request.post(remoteUrl.lendDetailInfo,options, function (error, response, body) {

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


//借出列表数据
router.post("/loanList",function(req, res, next){
    var session  =req.session;
    var userInfo = session.userInfo;
    var data = securityUtil(req);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    console.log(remoteUrl.loanList);
    request.post(remoteUrl.loanList,options, function (error, response, body) {
        if (!error) {
            try {
                var json_body = JSON.parse(body);
                console.log(json_body);

                json_body.userInfo = userInfo;
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

//加载借出详情
router.post("/loanDetail",function(req, res, next){
    var session  =req.session;
    var data = securityUtil(req);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    request.post(remoteUrl.loandetail,options, function (error, response, body) {
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
//修改组名
router.post("/changeName",function(req, res, next){
    var session  =req.session;
    var data = securityUtil(req);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    request.post(remoteUrl.changeGroupName,options, function (error, response, body) {
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

//删除分组
router.post("/deleteGroup",function(req, res, next){
    var session  =req.session;
    var data = securityUtil(req);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    console.log(options);
    request.post(remoteUrl.deleteGroup,options, function (error, response, body) {
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
//获取分组详情
router.post("/getAllMenbers",function(req, res, next){
    var session  =req.session;
    var data = securityUtil(req);
    var options = {
        form:data,
        headers:{
            session_id:session.api_session_id
        }
    }
    console.log(options);
    request.post(remoteUrl.detail,options, function (error, response, body) {
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








module.exports = router;