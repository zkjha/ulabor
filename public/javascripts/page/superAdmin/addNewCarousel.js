// zkj 2017/8/4
require.config({
    baseUrl:GV.STATIC_ROOT+"javascripts",
    shim:{
        "lib/requstUtil":{
            deps:['lib/jquery']
        },
        "lib/bootstrap":{
            deps: ['lib/jquery']
        },
        "lib/layer":{
            deps:["lib/jquery"]
        },
        "lib/webuploader":{
            deps:["lib/jquery"]
        },
        // "lib/uploader":{
        //     deps:["lib/jquery","lib/webuploader"]
        // }
    }
});
requirejs(['lib/jquery',"lib/layer","lib/myi18n",'lib/requstUtil',"lib/webuploader","lib/bootstrap"],
    function ($,Layer,myi18n,requstUtil,WebUploader) {
        var Add = {
            init:function () {
                //初始化图片上传插件节点
                Add.initWebuploader();
                Add.event();
                // Add.changeLan();
                // Add.initView();

            },
            event:function () {
                //点击切换按钮转换语言


                // //当点击为部分可见时动态加载分组信息
                // $("select").on("change",function (e) {
                //     if(e.target.value == 0){
                //         Add.getGourps(1);
                //     }
                // })


                // 点击确认新增按钮事件
                $("#addbutton").on("click",function () {
                    Layer.loading();
                    var options = Add.getParamsAndChecked();
                    if(options.msg){
                        alert(options.msg);
                        Layer.removeLoading();
                        return
                    }
                    requstUtil.request({
                        url:"/superAdmin/manage/ajaxCarousel/addNewCarousel",
                        data:options,
                        callback:function (data) {
                            Layer.removeLoading();
                            if(data.code == 1){
                                location.href = "/superAdmin/manage/carousel/carouselList";
                            }else{
                                alert(data.msg);
                                return;
                            }
                        }
                    })
                })

            },
            initViewByData:function (data) {
                if(data.iShareMoney) {
                    $("#iShareMoney").val(data.iShareMoney);
                }
                if(data.iShareNumber) {
                    $("#iShareNumber").val(data.iShareNumber);
                }
                //是否规划
                if(data.iIsNeedBack == 0) {
                    document.getElementById("checked_1").checked = false;
                }else{
                    document.getElementById("checked_1").checked = true;
                }
                //是否公开
                if(data.iIsPublic) {
                    $("#iIsPublic").val(data.iIsPublic);
                }
                //备注
                if(data.strShareRemarks){
                    $("#strShareRemarks").val(data.strShareRemarks);
                }
            },
            getParamsAndChecked:function () {
                var options = {};
                options.strAddress = $("#uploader").val();//图片地址
                if(!options.strAddress){
                    options.msg="请选择图片";
                    return options;
                }
                options.strType = $("#strType").val();//类型

                options.strUrl = $("#strUrl").val();//链接
                document.getElementById("checked_1").checked == true?(options.striIsDelete=0):(options.striIsDelete=-1);//是否可见
                return options;

            },
            getGourps:function (nowPage) {
                requstUtil.request({
                    url:'/admin/manage/ajaxResourse/getGroups',
                    data:{
                        pageNumber:nowPage,
                        pageSize:100
                    },
                    callback:function (data) {
                        if(data.code == 1){
                            Add.createGoups(data);
                        }else{
                            alert(data.msg);
                            return
                        }
                    }
                });
            },
            createGoups:function (data) {
                var list = data&&data.data&&data.data.list;
                var str = "<table class='groups_all'><tr>";
                var pageNum = 0;
                for(var i = 0,l=list.length;i<l;i++){
                    var data = list[i];
                    var nowPage = Number.parseInt(i/5);
                    if(nowPage>pageNum ){
                        pageNum = nowPage;
                        str +="</tr><tr><td class='group_item'><input type='checkbox' value='"+data.strGroupAndLaboratoryId+"' /><span class='span_1'>"+data.strGroupName+"<span class='span_2'>"+data.strName+"</span></span></td>"
                    }else{
                        str +="<td class='group_item'><input type='checkbox' value='"+data.strGroupAndLaboratoryId+"' /><span class='span_1'>"+data.strGroupName+"<span class='span_2'>"+data.strName+"</span></span></td>"
                    }
                }
                str +="</tr></table>"
                $("#groups").html(str);
                $(".groups_div").show();
            },
            changeLan:function (lan) {
                // var lan = lan||localStorage.getItem("lan");
                // myi18n.common({
                //     name:"resourse",
                //     lan:lan
                // })
            },

            initWebuploader:function () {
                requirejs(["lib/upload"]);
            }
        };
        Add.init();


    });