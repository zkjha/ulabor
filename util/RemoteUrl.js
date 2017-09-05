/**
 * Created by liupengyan on 16/12/13.
 * 请求地址路径对象
 */
var staticValue=require("./staticValue");
//是否为测试
var isTest=true;
var  RemoteUrl= {
            WEBBASEURL:"http://linux.fushoukeji.com",

            //上传图片
            upload:staticValue.API_BASE_PATH+"/app/had-login/file/imageUpload",
            uploadFile:staticValue.API_BASE_PATH+"/app/had-login/resources/batch/add",

            //批量下载二维码
            domnLoad:"/app/had-login/resources/export/resorce/qrcode/zip",//批量下载二维码
            qrCodeById:"/app/had-login/resources/export/resorce/qrcode",//下载单条二维码

            //登录接口
            userLogin:staticValue.API_BASE_PATH+"/app/email/password/login",//邮箱登录
            phoneLogin:staticValue.API_BASE_PATH+"/app/phone/password/login", //电话登录



            //资源管理
            addResourse:staticValue.API_BASE_PATH+"/app/had-login/resources/add", //新增资源
            getResourseList:staticValue.API_BASE_PATH+"/app/had-login/resources/labor/resource/list",//获取资源列表
            getResourseById:staticValue.API_BASE_PATH+"/app/resources/get/resource/id",//获取单条资源的数据
            changeDetail:staticValue.API_BASE_PATH+"/app/had-login/resources/change/resource/info",//修改资源详情
            addStorage:staticValue.API_BASE_PATH+"/app/had-login/resourcesstock/push-in",//新增入库
            storageList:staticValue.API_BASE_PATH+"/app/had-login/resourcesstock//get/stock/list",//入库列表
            setResourceSharing:staticValue.API_BASE_PATH+"/app/had-login/resources/set/iscan/share",//pi设置资源是否可以共享
            getGroups:staticValue.API_BASE_PATH+"/app/had-login/groupmanagement/get/user/groups",//获取当前用户的所有分组
            setShare:staticValue.API_BASE_PATH+"/app/had-login/resources/set/share",//共享设置
            getDataById:staticValue.API_BASE_PATH+"/app/resources/get/resource/id",//获取单条资源信息
            cancelShare:staticValue.API_BASE_PATH+"/app/had-login/resources/set/close/share",//取消共享


            //轮播图管理
            getCarouselList:staticValue.API_BASE_PATH+"/admin/had-login/getAllCarouselList",//获取轮播图列表



            //分组管理
            getAllLabor:staticValue.API_BASE_PATH+"/app/select/labor",//获取所有实验室列表;
            addGroup:staticValue.API_BASE_PATH+"/app/had-login/groupmanagement/create-group",//创建分组;
            getAllGroups:staticValue.API_BASE_PATH+"/app/had-login/groupmanagement/get/user/groups",//获取所有分组信息;
            joinGroups:staticValue.API_BASE_PATH+"/app/had-login/groupmanagement/whether/join-groups",//是否接受分组要求;
            changeGroupName:staticValue.API_BASE_PATH+"/app/had-login/groupmanagement/change/groupname",//修改组名;
            deleteGroup:staticValue.API_BASE_PATH+"/app/had-login/groupmanagement/dissolution-groups",//删除分组;
            groupDetail:staticValue.API_BASE_PATH+"/app/had-login/groupmanagement/get/group/detail",//获取分组成员列表;


            //审核管理
            applicationList:staticValue.API_BASE_PATH+"/app/had-login/review/application/list",//获取加入申请列表
            review:staticValue.API_BASE_PATH+"/app/had-login/review/application/review",//审核同意或拒绝
            loanAgree:staticValue.API_BASE_PATH+"/app/had-login/review/lend/review",//借用审核同意或拒绝
            loanList:staticValue.API_BASE_PATH+"/app/had-login/review/lend/list",//借出列表
            loandetail:staticValue.API_BASE_PATH+"/app/had-login/review/lend/detail",//借出详情


            //借出管理
            myLend:staticValue.API_BASE_PATH+"/app/had-login/borrowlend/lend/list",//我的借出列表
            receipt:staticValue.API_BASE_PATH+"/app/had-login/borrowlend/click/receipt",//确认收货
            lendDetailInfo:staticValue.API_BASE_PATH+"/app/had-login/borrowlend/lend/detail",//详细页面



            //用户管理
            getAllMenbers:staticValue.API_BASE_PATH+"/app/had-login/usercenter/access/information",//获取所有实验室成员
            changeRole:staticValue.API_BASE_PATH+"/app/had-login/usercenter/access/userright",//改变权限
            removeMenber:staticValue.API_BASE_PATH+"/app/kick/out/labor",//踢出成员









    //超级管理员
            //登录
            superAdminLogin:staticValue.API_BASE_PATH+"/adminUser/login",//超级管理员登录

            //轮播图管理
            getAllCarouselList:staticValue.API_BASE_PATH+"/admin/had-login/getAllCarouselList",//获取轮播图列表
            deleteCarouse:staticValue.API_BASE_PATH+"/admin/had-login/reviseCarousel",//隐藏轮播图
            addCarousel:staticValue.API_BASE_PATH+"/admin/had-login/addCarousel",//新增轮播图

            //实验室审核列表
            getLaborList:staticValue.API_BASE_PATH+"/admin/had-login/review/create/labor/list",//获取实验室列表
            agreeOrRefuse:staticValue.API_BASE_PATH+"/admin/had-login/review/create/Labor/review",//获取实验室列表

            //上传文件
            superUpload:staticValue.API_BASE_PATH+"/admin/had-login/file/imageUpload",//上传图片





};






module.exports=RemoteUrl;