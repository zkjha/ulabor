
require.config({
    baseUrl : GV.STATIC_ROOT + "javascripts",
    shim:{
        "lib/bootstrap":{
            deps: ['lib/jquery']
        }
    }
});

// Start the main app logic.
requirejs(
    [ 'lib/jquery','lib/bootstrap'],
    function($) {



        var Sign={
            init:function(){
                Sign.event();
                //var userphone=Sign.getCookie("user_phone");
                //$("#J_user_tel").val(userphone);
                var timeNum=Sign.getCookie("timeNum");
                var strPhone=Sign.getCookie("strPhone");
                $("#J_strPhone").val(strPhone);
                if(timeNum&&timeNum>0){
                    var showImageCodeBtn=$("#J_showImageCodeBtn");
                    var timer=setInterval(function(){
                        timeNum--;
                        Sign.setCookie("timeNum",timeNum,timeNum*1000);
                        if(timeNum<=0){
                            clearInterval(timer);
                            showImageCodeBtn.removeClass("btn-empty-disable");
                            showImageCodeBtn.text("获取验证码");
                        }else{
                            showImageCodeBtn.addClass("btn-empty-disable");
                            showImageCodeBtn.text(timeNum+"s重新获取");
                        }
                    },1000);
                };

                //选中同意协议

                $("#J_is_agree_radio").click();

            },
            event:function(){

               $("#J_strPhone").on("input porpertychange",function(){
                  Sign. checkDataValid();
               });
                $("#J_strSmsVerifyCode").on("input porpertychange",function(){
                    Sign.checkDataValid();
                });
                $("#J_is_agree_radio").click(function(){

                    var _this_checked=$(this).attr("data-checked");
                    if(_this_checked=="1"){
                        $(this).attr("data-checked","0").find("i").removeClass("fa-dot-circle-o");
                    }else {
                        $(this).attr("data-checked","1").find("i").addClass("fa-dot-circle-o");
                    }



                    Sign.checkDataValid();
                });


                //重置图形验证码
              $("body").on("click","#J_strImgVerifyCodeId",function(){

                    requstUtil.request({

                        url: "/ajaxusers/getImageVerifyCode",
                        data: {},
                        callback: function (rs) {
                            var code = rs.code;

                            if (code == 1) {
                                var data=rs.data;

                                var strImgVerifyCode= data.strImgVerifyCode;
                                var strImgVerifyCodeId=data.strImgVerifyCodeId;
                                $("#J_strImgVerifyCodeId").attr("src",strImgVerifyCode).attr("data-strImgVerifyCodeId",strImgVerifyCodeId);
                            }
                        }
                    });
                });
                //显示图形验证码
                $("#J_showImageCodeBtn").on("click",function(){

                    if($(this).hasClass("btn-empty-disable")){
                        return;
                    }
                    //开始校验用户输入的手机号是否合法
                    //获取用户手机号
                    var strPhone=$("#J_strPhone").val();


                    var myreg = /^(((13[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})||(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                    if(!myreg.test(strPhone)){
                        $("#J_strPhone").parent().addClass("input-error-lg");
                        $("#J_str_phone_error_info").text("请输入正确手机号");
                        return;
                    }else{
                        $("#J_strPhone").parent().removeClass("input-error-lg");
                    }

                    Sign.setCookie("strPhone",strPhone,180*24*60*60*1000);
                    requstUtil.btnRequire({

                        url:"/ajaxusers/getImageVerifyCode",
                        data:{},
                        _this_btn:$(this),
                        callback:function(rs){


                            var code=rs.code;

                            if(code==1){
                                var data=rs.data;

                                var strImgVerifyCode= data.strImgVerifyCode;
                                var strImgVerifyCodeId=data.strImgVerifyCodeId;
                                var html='<div class="image-code-container">'
                                    +'<div class="input-container-s ">'
                                    +'<input id="J_strImgVerifyCode" type="text" maxlength="4" placeholder="验证码" name="username"/>'
                                    +'<i class="fa fa-exclamation" aria-hidden="true"></i>'
                                    +'<span id="J_strImgVerifyCode_error_info">验证码错误</span>'
                                    +'</div>'
                                    +'<img id="J_strImgVerifyCodeId" data-strImgVerifyCodeId='+strImgVerifyCodeId+' src="'+strImgVerifyCode+'"/>'

                                    +'</div>';
                               var controllerConfirm= $.tips.controllerConfirm(html,"请输入图形验证码",function(rs){
                                    if(rs){
                                        //获取用户电话
                                        var strPhone=$("#J_strPhone").val();
                                        //获取验证码
                                        var strImgVerifyCode=  $("#J_strImgVerifyCode").val();
                                        //图形验证码ID
                                        var strImgVerifyCodeId=$("#J_strImgVerifyCodeId").attr("data-strImgVerifyCodeId");

                                        if(!strImgVerifyCode){
                                           $("#J_strImgVerifyCode").parent().addClass("input-error-s");
                                            $("#J_strImgVerifyCode_error_info").text("验证码必填");
                                            return;
                                        }


                                        if(strImgVerifyCode.length<4){
                                            $("#J_strImgVerifyCode").parent().addClass("input-error-s");
                                            $("#J_strImgVerifyCode_error_info").text("验证码错误");
                                            return;
                                        }

                                        var _that=$("#J_alert_sure");
                                        //请求短信验证码
                                        requstUtil.btnRequire({
                                            url: "/ajaxusers/sendSmsVerifyCode",
                                            data: {"strImgVerifyCode":strImgVerifyCode,"strImgVerifyCodeId":strImgVerifyCodeId,"strPhone":strPhone},
                                            _this_btn: _that,
                                            callback: function (rs) {

                                                var code=rs.code;
                                                if(code==1){


                                                    //$.tips.alert("短信验证码:"+rs.data);
                                                    //发送按钮开始倒计时
                                                    var timeNum=60;
                                                    var showImageCodeBtn=$("#J_showImageCodeBtn");
                                                    var timer=setInterval(function(){
                                                        timeNum--;
                                                        Sign.setCookie("timeNum",timeNum,timeNum*1000);
                                                        if(timeNum<=0){
                                                            clearInterval(timer);
                                                            showImageCodeBtn.removeClass("btn-empty-disable");
                                                            showImageCodeBtn.text("获取验证码");
                                                        }else{
                                                            showImageCodeBtn.addClass("btn-empty-disable");
                                                            showImageCodeBtn.text(timeNum+"s重新获取");
                                                        }
                                                    },1000);
                                                    //关闭弹窗
                                                    controllerConfirm.close();
                                                }else if(code==1005){
                                                    //验证码错误
                                                    $("#J_strImgVerifyCode").parent().addClass("input-error-s");
                                                    $("#J_strImgVerifyCode_error_info").text("验证码错误");
                                                    return;
                                                }else if(code==1004){
                                                    //手机号不合法
                                                    $("#J_strPhone").parent().addClass("input-error-lg");
                                                    $("#J_str_phone_error_info").text("请输入正确手机号");
                                                    controllerConfirm.close();
                                                    return;
                                                }

                                            }
                                        });
                                    }
                                })
                            }
                        }

                    });

                });

                //点击登录
                $("#J_login_btn").on("click",function(){
                    // Sign.login($(this));
                    var $btn = $(this).button('loading')
                    // business logic...
                    $btn.button('reset')
                });
                //回车登录
                $(document).keydown(function(e){
                    if(e.keyCode==13){
                        var _this_btn=$("#J_login_btn");
                        Sign.login(_this_btn);
                    }
                });
                $("#J_prot_checkbox_parent").on("click",function(){
                    var has_bear_gou=$("#J_prot_checkbox").hasClass("bear_gou");
                    if(has_bear_gou){
                        $("#J_prot_checkbox").removeClass("bear_gou");

                    }else{
                        $("#J_prot_checkbox").addClass("bear_gou")
                    }
                });

            }
            //设置cookie
            , setCookie:function(name,value,time)
            {
                //var Days = 180;
                var exp = new Date();
                exp.setTime(exp.getTime() +time);
                document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
            }
            //得到cookie
            , getCookie:function(name)
            {
                var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
                if(arr=document.cookie.match(reg))
                    return unescape(arr[2]);
                else
                    return null;
            }

            ,
            //删除cookie
            delCookie:function(name)
            {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval=Sign.getCookie(name);
                if(cval!=null)
                    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
            }

            //检测用户登陆数据 是否可以提交登陆
            //如果数据不合法 登陆按钮为灰色状态
            //否则可以点击登陆
            ,checkDataValid:function(){
                var strPhone=$("#J_strPhone").val();

                var myreg = /^(((13[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})||(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if(!myreg.test(strPhone)){
                   $("#J_login_btn").addClass("btn-empty-disable");
                    return;
                }else{

                    $("#J_strPhone").parent().removeClass("input-error-lg");
                }
                //短信验证码
                var strSmsVerifyCode=$("#J_strSmsVerifyCode").val();

                if(strSmsVerifyCode.length<4){
                    $("#J_login_btn").addClass("btn-empty-disable");
                    return;
                }else{
                    $("#J_strSmsVerifyCode").parent().removeClass("input-error-lg");
                }

                //用户是否同意协议
               var isAgree=  $("#J_is_agree_radio").attr("data-checked");
                if(isAgree!='1'){
                    $("#J_login_btn").addClass("btn-empty-disable");
                    return;
                }
                $("#J_login_btn").removeClass("btn-empty-disable");
            }

            //登录 数据交互
            ,login:function(_this_btn){

                //数据不合法 不执行
                if(_this_btn.hasClass("btn-empty-disable")){
                    return;
                }

                var strPhone=$("#J_strPhone").val();
                var strSmsVerifyCode=$("#J_strSmsVerifyCode").val();

                //推荐人类型
                var strReferrerType=$("#J_strReferrerType").val();

                //推荐人ID
                var strReferrerId=$("#J_strReferrerId").val();




                var data={
                    "strPhone":strPhone,
                    "strSmsVerifyCode":strSmsVerifyCode,
                    "strReferrerType":strReferrerType,
                    "strReferrerId":strReferrerId
                };


                requstUtil.btnRequire({

                    url:"/ajaxusers/ajax-sign",
                    data:data,
                    _this_btn:_this_btn,
                    callback:function(result){

                        var data = result;
                        var result_code = data.code;

                        if(result_code==1){

                                Sign.setCookie("strPhone",strPhone);

                            var url = $("#J_url").val();

                            if(!url||url=="/"){
                                window.location.href= "/had-login/usercenter/index";
                            }else{
                                window.location.href= url;
                            }

                        }else if (result_code==1006){
                            //短信验证码错误

                            $("#J_strSmsVerifyCode").parent().addClass("input-error-lg");
                            $("#J_showImageCodeBtn").text(data.msg);

                        }
                    }

                });


            }


        };
        Sign.init();



    });
