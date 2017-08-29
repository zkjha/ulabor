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
    'lib/layer',
    "lib/requstUtil",
    "lib/bootstrap",
    "lib/jqueryPage",
    ], function ($,Layer,requstUtil) {
        var List={
            init:function () {
                List.event();
                List.getPageToView(1);
            },
            event:function () {
                //监听新增按钮点击事件
                $("#addGroup").on("click",function () {
                    // 跳转到新增页面
                    location.href="/admin/manage/group/addGroup";
                });

                //监听同意加入和拒绝加入分组点击事件
                $("#j_body").on("click",".in_group",function () {
                    var strGroupAndLaboratoryId = $(this).attr("data-id");
                    var iIsagree = 0;
                    if($(this).hasClass("agree_group")){
                        //同意按钮点击事件
                        iIsagree = 1;
                    }else{
                        //拒绝按钮点击事件
                        iIsagree = -1;
                    }
                    requstUtil.request({
                       url:"/admin/manage/group/agreeIntoGroup",
                       data:{
                           strGroupAndLaboratoryId:strGroupAndLaboratoryId,
                           iIsagree:iIsagree
                       },
                        callback:function (data) {
                            if(data.code == 1){
                                alert("操作成功");
                                location.href = "/admin/manage/group/groupList";
                            }else{
                                alert(data.msg);
                                return;
                            }
                        }

                    });

                });

                //查看详细成员信息
                $("#j_body").on("click",".detail",function () {
                    var strId = $(this).attr("data-id");
                    var strName = $(this).attr("data-name");
                   //跳转到成员详细信息
                    location.href="/admin/manage/group/detail?"+strId+","+strName;

                 });

                //点击修改分组名称
                $("#j_body").on("click",".update_groupName",function () {
                    var strGroupId = $(this).attr("data-id");
                    Layer.layer({
                        type:"search",
                        title:"请输入新的组名",
                        callback:function(value){
                            var strGroupName = value;
                            if(!strGroupName){
                                alert("没有组名");
                                return;

                            }
                            if(!strGroupId){
                                alert("没有组件id");
                                return;
                            }
                            requstUtil.request({
                                url:'/admin/manage/ajaxGroup/changeName',
                                data:{
                                    strGroupId:strGroupId,
                                    strGroupName:strGroupName
                                },
                                callback:function (data) {
                                    if(data.code == 1){
                                        alert("操作成功");
                                        location.href = "/admin/manage/group/groupList";
                                    }else{
                                        alert(data.msg);
                                        return;
                                    }
                                }
                            })
                        }
                    })
                });

                //删除分组
                $("#j_body").on("click",".delete_group",function () {
                   var strGroupId = $(this).attr("data-id");
                    requstUtil.request({
                        url:"/admin/manage/ajaxGroup/deleteGroup",
                        data:{
                            strGroupId:strGroupId
                        },
                        callback:function (data) {
                            if(data.code == 1){
                                alert("操作成功");
                                location.href = "/admin/manage/group/groupList";
                            }else{
                                alert(data.msg);
                                return;
                            }
                        }
                    })
                });

            },
            getPageToView:function (nowPage,options) {
                var option = {
                    pageSize:10,
                    pageNumber:nowPage
                }
                if(options){
                    for(var i in options){
                        option[i] = options[i];
                    }
                }
                List.nowPage = nowPage;
                requstUtil.request({
                    url:'/admin/manage/ajaxGroup/groupList',
                    data:option,
                    callback:function (data) {
                        if(data.code == 1){
                            // console.log(data.data);
                            List.createElement(data);
                        }else{
                            alert(data.msg);
                            return
                        }
                    }
                });
            },
            createElement:function (dataList) {
                var datas = dataList.data||{};
                var userInfo = dataList.userInfo||{};
                var list = datas.list||[];
                var str = "";
                for(var i = 0,l=list.length;i<l;i++){
                    var data = list[i]||{};
                    var dataId = data.strGroupId||'';
                    str +="<tr>";
                    str +="<td>"+(data.strGroupName||'')+"</td>";//实验室名称
                    str +="<td>"+(data.strCreateTime||'')+"</td>";//创建时间
                    str +="<td>"+(data.strName||'')+"</td>";//所属实验室名字
                    str +="<td>"+(data.strParentUnit||"")+"</td>";//实验室所属单位
                    switch (data.isAgree){
                        case 0:
                            str +="<td class='groupType_td' ><span class='notInGroup groupType i18n'  data-title='Shared'>未加入</span></td>";//是否加入
                            break;
                        case 1:
                            str +="<td class='groupType_td' ><span class='groupType joinGroup i18n'  data-title='Shared'>已加入</span></td>";//是否加入
                            break;
                        case -1:
                            str +="<td class='groupType_td' ><span class='groupType refuseGroup i18n'  data-title='Shared'>已拒绝</span></td>";//是否加入
                            break;
                        default:
                            str +="<td class='groupType_td' ><span class='groupType i18n'  data-title='Shared'></td>";
                    }
                    //获取用户信息用来处理不同操作

                    //如果还没有加入，则只能处理是否加入
                    if(data.isAgree == 0){
                        str +="<td><span class=' i18n action_span agree_group in_group' data-title='' data-id='"+data.strGroupAndLaboratoryId+"'>同意</span><span class=' action_span i18n refuse_group in_group' data-title='' data-id='"+data.strGroupAndLaboratoryId+"'>拒绝</span>"
                    }else{
                        //查看群成员
                        str +="<td><span class=' i18n detail action_span' data-name='"+data.strGroupName+"' data-id='"+dataId+"' data-title=''>查看</span>";
                        //如果该分组为本实验所有
                        if(data.strCreateLaboratory == userInfo.strLaboratoryId){
                            //本实验室可以有修改群名片和解散分组动作
                            if(userInfo.strUserType == 2||userInfo.strUserinfoId == data.strCreateUserId){
                                //实验室pi和创建者manage可以进行解散分组及修改名称动作
                                str +="<span class=' i18n update_groupName action_span' data-id='"+dataId+"' data-title=''>修改</span><span class=' i18n delete_group action_span' data-id='"+dataId+"' data-title=''>删除</span>"
                            }
                        }else{
                            //否则就只能退出
                            str +="<span class=' i18n quit_group action_span'>退出</span>"
                        }


                    }
                    str+="</td>"


                    str +="</tr>"

                }
                $("#j_body").html(str);
                $("#j_footer").html("<span><span class='i18n' data-title='tips_one'>总共</span>&nbsp&nbsp"+dataList.data.iTotalpages+"&nbsp&nbsp<span class='i18n' data-title='pages'>页</span> ，<span class='i18n' data-title='tips_two'>当前为第</span>&nbsp&nbsp"+ List.nowPage +"&nbsp&nbsp<span  class='i18n' data-title='pages'> 页</span></span>");
                $("#j_pageNum").html("");
                $("#j_pageNum").pagination({
                    count: dataList.data.iTotalrecords, //总数
                    size: 10, //每页数量
                    index: List.nowPage,//当前页
                    lrCount: 3,//当前页左右最多显示的数量
                    lCount: 1,//最开始预留的数量
                    rCount: 1,//最后预留的数量
                    callback: function (options) {
                        List.getPageToView(options.index);
                    }
                });

                //转换语言
                //list.changeLan();
            },
        };
        List.init();
});