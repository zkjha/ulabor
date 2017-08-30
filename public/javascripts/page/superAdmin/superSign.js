
require.config({
    baseUrl : GV.STATIC_ROOT + "javascripts",
    shim:{

        "lib/requstUtil":{
            deps:['lib/jquery']
        },
        "lib/layer":{
            deps:["lib/jquery"]
        },
        "lib/bootstrap":{
            deps: ['lib/jquery']
        }
    }
});

// Start the main app logic.
requirejs(
    [ 'lib/jquery','lib/requstUtil','lib/layer','lib/myi18n','lib/bootstrap'],
    function($,requstUtil,layer,myi18n) {



        var Sign={
            lan:'',
            init:function(){
                Sign.event();
                //登录界面根据浏览器转换语言
                Sign.changeLan();

            },
            event:function() {



                //登录按钮点击事件
                $(".loginBtn").on("click",Sign.userLogin);

                //回车登录事件
                $(".password").on("keypress",function (e) {
                    if(e.keyCode == 13){
                        Sign.userLogin.call(this);
                    }
                })
            },
            userLogin:function (dom) {

                var msg = "";
                //用户输入值获取d对象
                var options = {};
                    //邮箱登录
                options.adminName = $("#userName").val();//用户名
                options.strPassword = $("#inputPassword").val();//密码
                msg = Sign.checkParams(options);
                if (msg) {
                    layer.alert(msg,1000);
                    // layer.layer({
                    //     type:"confirm",
                    //     title:'strUserPhoneError',
                    //     lan:"en",
                    //     name:"index",
                    //     callback:function (data) {
                    //         if(data == 0){
                    //             console.log("0")
                    //         }else{
                    //             console.log("1");
                    //         }
                    //     }
                    // });
                    return
                }
                requstUtil.request({
                    url: "/superAdmin/ajax-sign-in-web",
                    data: {
                        adminName:options.adminName,
                        adminPassword:options.strPassword
                    },
                    callback: function (data) {
                        if (data.code == 1) {
                            layer.alert("loginSuc",1000);
                            localStorage.setItem("superAdmin",true);
                            location.href = "/superAdmin/manage";
                        } else {
                            if(data.code == 100004){
                                layer.alert("passwordError",1000);
                                return;
                            }else if(data.code ==100010){
                                layer.alert("emailNotFound",1000);
                                return;
                            }else if(data.code == 100003){
                                layer.alert("emailNotFound",1000);
                                return;
                            }else if(data.code == 100012){
                                layer.alert("phoneNotRegistry",1000);
                            }else{
                                layer.alert("loginFail",1000);
                                return;
                            }

                        }
                    }
                });
            },

            checkParams:function (params) {
                var errMsg = "";
                for(var name in params){
                    //验证是否为空
                    if(!params[name]){

                        errMsg =  name+"Null";
                        return errMsg;
                    }
                }
                return errMsg;
            },

            changeLan:function () {
                var optionEle = $("#i18n_pagename");
                var sourceName = optionEle.attr('content');
                var result = Sign.getNavigatorLanguage();
                var i18nLanguage;
                if(typeof  result =="object"){
                    //登录页面默认语言为浏览器语言,如果用户登录后已经选择了默认语言，则以默认语言为准
                    i18nLanguage =  localStorage.getItem("lan")||result.language.substr(0,2);
                    localStorage.setItem("navigatorLan",result.language.substr(0,2));//缓存浏览器，
                }else{
                    alert(result);
                    return;
                }
                myi18n.common({
                    name:sourceName,
                    lan:i18nLanguage
                })
            },
            getNavigatorLanguage:function () {
                if(navigator){
                    //判断是否是浏览器
                    if(navigator.appName == "Netscape"||navigator.appName=="Microsoft Internet Explorer"){
                        return   { language:(navigator.language||navigator.userLanguage)};
                    }else{
                        return "is not browser!";
                    }
                }else{
                    return "cannot find navigator";
                }
            }

        };
        Sign.init();



    });
