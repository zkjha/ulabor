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
    function ($,layer,myi18n,requstUtil,WebUploader) {
        var Add = {
            init:function () {
                //初始化图片上传插件节点
                Add.initWebuploader();
                Add.event();
                Add.changeLan();
                Add.initView();

            },
            initView:function(){
                var strId = location.href.split("?")[1].split("=")[1];
                requstUtil.request({
                    url:"/admin/manage/ajaxResourse/getDateByStrResourcesId",
                    data:{
                        strResourcesId:strId
                    },
                    callback:function (data) {
                        // console.log(data);
                        if(data.code == 1){
                            var msgdata = data.data.resource;
                            Add.initViewByData(msgdata);
                        }
                    }
                })
            },
            event:function () {
                //点击切换按钮转换语言


                //当点击为部分可见时动态加载分组信息
                $("select").on("change",function (e) {
                    if(e.target.value == 0){
                        Add.getGourps(1);
                    }
                })


                // 点击确认分享按钮事件
                $("#addbutton").on("click",function () {
                    var options = Add.getParamsAndChecked();
                    if(options.msg){
                        alert(options.msg);
                        return
                    }
                    requstUtil.request({
                        url:"/admin/manage/ajaxResourse/managerSettingShare",
                        data:options,
                        callback:function (data) {
                            if(data.code == 1){
                                alert("操作成功");
                                location.href = "/admin/manage/resourse/resourseList";
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
                var url = location.href;
                options.strResourcesId = url.split("?")[1].split("=")[1];
                if(!options.strResourcesId){
                    return options.msg='not found resources' ;
                }
                options.strShareRemarks = $("#strShareRemarks").val();//备注信息
                options.strImages = $("#uploader").val();//图片地址
                options.iShareMoney = $("#iShareMoney").val();//g共享金额
                if(isNaN(options.iShareMoney)){
                   options.msg = "请输入数字类型的共享金额";
                   return options;
                }
                options.iIsPublic = $("#iIsPublic").val();//s是否公开
                var newArr=[];
                $(".group_item [type='checkbox']:checked").each(function (index,item) {
                    newArr.push(item.value)
                });
                options.strGroupIds = newArr.join(",");//分组id
                options.iShareNumber = $("#iShareNumber").val();
                if(isNaN(options.iShareNumber)){
                    options.msg = "请输入数字类型的共享数量";
                    return options;
                }
                document.getElementById("checked_1").checked == true?(options.iIsNeedBack=1):(options.iIsNeedBack=0);//是否归还
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