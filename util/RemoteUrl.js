/**
 * Created by liupengyan on 16/12/13.
 * 请求地址路径对象
 */
var staticValue=require("./staticValue");
//是否为测试
var isTest=true;
var  RemoteUrl= {
            WEBBASEURL:"http://linux.fushoukeji.com",
            userLogin:staticValue.API_BASE_PATH+"/app/phone/password/login"


};






module.exports=RemoteUrl;