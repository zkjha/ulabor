/**
 * Created by liupengyan on 16/12/13.
 * 请求地址路径对象
 */
var staticValue=require("./staticValue");
//是否为测试
var isTest=true;
var  RemoteUrl= {
            WEBBASEURL:"http://linux.fushoukeji.com",

            //登录接口
            userLogin:staticValue.API_BASE_PATH+"/app/email/password/login",//邮箱登录
            phoneLogin:staticValue.API_BASE_PATH+"/app/phone/password/login", //电话登录



            //资源管理
            addResourse:staticValue.API_BASE_PATH+"/app/had-login/resources/userdata", //新增资源
            getResourseList:staticValue.API_BASE_PATH+"/app/had-login/resources/sharing",//获取资源列表
            addStorage:staticValue.API_BASE_PATH+"/app/had-login/resourcesstock/push-in",//新增入库




};






module.exports=RemoteUrl;