require.config({
    baseUrl:GV.STATIC_ROOT+"javascripts",
    shim:{
        "lib/requstUtil":{
            deps:['lib/jquery']
        },
        "lib/jqueryPage":{
            deps:['lib/jquery']
        },
        "lib/bootstrap":{
            deps: ['lib/jquery']
        }
    }
});
requirejs([
    'lib/jquery',
    "lib/requstUtil",
    "lib/jqueryPage"
],function ($,requstUtil) {
    var detail = {
        init:function () {
           //初始化页面
            var id = location.href.split("?")[1];
            detail.initView(id);
        },
        initView:function (id) {
            requstUtil.request({
                url:'/admin/manage/ajaxReview/loanDetail',
                data:{
                    strReviewInfoId:id
                },
                callback:function (data) {
                    if(data.code == 1){
                        console.log(data.data);
                        detail.initViewByData(data.data);
                    }else{
                        alert(data.msg);
                        return
                    }
                }
            })
        },
        initViewByData:function (data) {
            var root = data.strImgRootPath||'';
            var detailData = data&&data.data||{};
            //申请人姓名
            $("#strNickName").val((detailData.strNickName||''));
            //所属单位
            $("#strLaborName").val((detailData.strLaborName||''));
            //申请时间
            $("#strCreateTime").val((detailData.strCreateTime||''));
            //归还时间
            $("#strDeleteTime").val((detailData.strDeleteTime||''));
            //资源名称
            $("#resName").val((detailData.resName||''));
            //资源类型
            $("#resType").val((detailData.resType||''));
            //实验币
            $("#resdecMoney").val((detailData.resdecMoney||''));
            //库存
            $("#resiNumber").val((detailData.resiNumber||''));
            //库存
            var imgArr = detailData.resImages.split(","),str="";
            for(var i = 0,l=imgArr.length;i<l;i++){
                if(imgArr){
                    str +="<div ><img class='detailImg' src='"+(root+imgArr[i])+"'></div>";
                }
            }
            $("#resImg").html(str);
        }
    };
    detail.init();
});