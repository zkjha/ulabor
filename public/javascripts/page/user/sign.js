
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

                //点击切换登录方式
                $(".changeLoginMethod").on("click", function (e) {
                    var method = $(this).attr("data-method");
                    var rootDoms = $(".form-signin");
                    rootDoms.each(function (index, rootDom) {
                        if ($(rootDom).hasClass(method)) {
                            $(rootDom).hasClass("hidden") ? "" : $(rootDom).addClass("hidden");
                        } else {
                            $(rootDom).removeClass("hidden");
                        }
                    })
                });

                //手机登录时选择区域刷新电话label值
                $("#areaNo").on("change", function (e) {
                    var value = e.target.value;
                    $(".areaNo").html(value);
                })

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
                //判断是那种形式登录
                var type = $(this).attr("data-type");
                var msg = "";
                //用户输入值获取d对象
                var options = {};
                if (type == "email") {
                    //邮箱登录
                    options.strUserEmail = $("#inputEmail").val();//邮箱输入
                    options.strPassword = $("#inputPassword").val();//密码输入
                } else {
                    options.strRegionNumber = $(".areaNo").html();//国家区号
                    options.strPassword = $("#phonePassword").val();//手机登录密码
                    options.strUserPhone = $("#strUserPhone").val();//手机登录密码

                }
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
                    url: type=="email"?"/admin/ajax-sign-in-web":"/admin/ajax-sign-in-web/phoneLogin",
                    data: options,
                    callback: function (data) {
                        if (data.code == 1) {
                            layer.alert("loginSuc",1000);
                            location.href = "/admin/manage";
                        } else {
                            if(data.code == 100004){
                                layer.alert("passwordError",1000);
                                return;
                            }else if(data.code ==100010){
                                layer.alert("emailNotFound",1000);
                                return;
                            }else if(data.code == 100014){
                                layer.alert("numberNotUse",1000);
                                return;
                            }else {
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
                    }else{
                        //验证具体值的合法性
                        if(name == "strUserEmail"){
                            var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                            if(!myreg.test(params[name])){
                                errMsg = name+"Error";
                                return errMsg
                            }
                        }
                        if(name == "strUserPhone" ){
                            var phone = /^1[3|4|5|7|8][0-9]{9}$/;
                            if(!phone.test(params[name])){
                                errMsg =name+"Error";
                                return errMsg;
                            }
                        }
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
