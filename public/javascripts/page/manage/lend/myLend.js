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
requirejs(['lib/jquery','lib/layer',"lib/requstUtil",'lib/myi18n',"lib/jqueryPage","lib/bootstrap"],
    function ($,Layer,requstUtil,myi18n) {
        var List = {
            init:function () {
                List.event();
                var iIsorientation = $("#iIsorientation").val();
                List.getPageToView(1,{
                    iIsorientation:iIsorientation
                });
            },
            event:function () {
                //监听查询按钮点击事件
                $("#searchBtn").on("click",function () {
                    List.iIsorientation = $("#iIsorientation").val();
                    List.returned = $("#returned").val();
                    List.getPageToView(1,{
                        iIsorientation:List.iIsorientation,
                        returned:List.returned,
                    })

                })

                //监听详情点击页面
                $("#j_body").on("click",".detail",function () {
                    var strId = $(this).attr("data-id");
                    location.href="/admin/manage/lend/loanDetail?"+strId;
                })


                //监听收货按钮点击事件
                $("#j_body").on("click",".receipt",function () {
                    var borrowLendId = $(this).attr("data-id");
                    List.getAgreeRequest({
                        borrowLendId:borrowLendId
                    })
                });




            },
            getAgreeRequest:function (options) {
                requstUtil.request({
                    url:"/admin/manage/ajaxLend/receipt",
                    data:options,
                    callback:function (data) {
                        if(data.code == 1){
                            alert("操作成功");
                            location.href = "/admin/manage/lend/myLend";
                        }else{
                            alert(data.msg);
                            return;
                        }
                    }

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
                    url:'/admin/manage/ajaxlend/lendList',
                    data:option,
                    callback:function (data) {
                        if(data.code == 1){
                            console.log(data.data);
                            List.createElement(data);
                        }else if(data.code == -8){
                            $("#j_body").html("");
                            $("#j_footer").html("");
                            $("#j_pageNum").html("");
                            alert(data.msg);
                            return
                        }else{
                            alert(data.msg);
                            return
                        }
                    }
                });
            },
            createElement:function (dataList) {
                //初始化节点
                $("#j_body").html("");
                $("#j_footer").html("");
                $("#j_pageNum").html("");


                var datas = dataList.data||{};
                var root = datas.strImgRootPath;
                // var userInfo = dataList.userInfo||{};
                var list = datas.dataList||[];
                var str = "";
                for(var i = 0,l=list.length;i<l;i++){
                    var data = list[i]||{};
                    var dataId = data.borrowLendId||'';
                    str +="<tr>";
                    str +="<td>"+(data.strName||'')+"</td>";//资源名称
                    str +="<td>"+(data.strNickName||'')+"</td>";//借用人
                    str +="<td>"+(data.strCreateTime||'')+"</td>";//借出时间
                    str +="<td>"+(data.strUpdateTime||'')+"</td>";//归还时间
                    switch (data.returned){//归还状态
                        case 0:
                            str +="<td class='joinType_td groupType_td ' ><span class='joinType_td groupType joinGroup i18n'  data-title='Shared'>已归还</span></td>";//是否加入
                            break;
                        case 1:
                            str +="<td class='joinType_td groupType_td ' ><span class='joinType_td groupType joinGroup i18n'  data-title='Shared'>待归还</span></td>";//是否加入
                            break;
                        case -1:
                            str +="<td class='joinType_td groupType_td ' ><span class='joinType_td groupType joinGroup i18n'  data-title='Shared'>待确认</span></td>";//是否加入
                            break;
                        default:
                            str +="<td class='joinType_td groupType_td ' ><span class='joinType_td notInGroup groupType i18n'  data-title='Shared'>已归还</span></td>";
                    }
                    //获取用户信息用来处理不同操作

                    //如果状态未-1，对方已点击归还，显示收货按钮
                    if(data.returned == -1){
                        str +="<td><span class='i18n action_span receipt agree_group  in_group joinType_td' data-title='' data-id='"+dataId+"'>收货</span>" +
                            "<span class='action_span i18n refuse_group detail joinType_td' data-title='' data-id='"+dataId+"'>详情</span>"
                    }else{
                        // //查看群成员
                        // str +="<td><span class='i18n detail action_span' data-name='"+data.strGroupName+"' data-id='"+dataId+"' data-title=''>查看</span>";
                        // //如果该分组为本实验所有
                        // if(data.strCreateLaboratory == userInfo.strLaboratoryId){
                        //     //本实验室可以有修改群名片和解散分组动作
                        //     if(userInfo.strUserType == 2||userInfo.strUserinfoId == data.strCreateUserId){
                        //         //实验室pi和创建者manage可以进行解散分组及修改名称动作
                        //         str +="<span class='i18n update_groupName action_span' data-id='"+dataId+"' data-title=''>修改</span><span class='i18n delete_group action_span' data-id='"+dataId+"' data-title=''>删除</span>"
                        //     }
                        // }else{
                        //     //否则就只能退出
                        //     str +="<span class='i18n quit_group action_span'>退出</span>"
                        // }
                        str+="<td> <span class='action_span i18n refuse_group detail joinType_td' data-title='' data-id='"+dataId+"'>详情</span>"


                    }
                    str+="</td>"


                    str +="</tr>"

                }
                $("#j_body").html(str);
                $("#j_footer").html("<span><span class='i18n' data-title='tips_one'>总共</span>&nbsp&nbsp"+dataList.data.iTotalpages+"&nbsp&nbsp<span class='i18n' data-title='pages'>页</span> ，<span class='i18n' data-title='tips_two'>当前为第</span>&nbsp&nbsp"+ List.nowPage +"&nbsp&nbsp<span  class='i18n' data-title='pages'> 页</span></span>");

                $("#j_pageNum").pagination({
                    count: dataList.data.iTotalrecords, //总数
                    size: 10, //每页数量
                    index: List.nowPage,//当前页
                    lrCount: 3,//当前页左右最多显示的数量
                    lCount: 1,//最开始预留的数量
                    rCount: 1,//最后预留的数量
                    callback: function (options) {
                        List.getPageToView(options.index,{
                            strReviewResult:list.strReviewResult,
                            strIsHadReview:List.strIsHadReview == "true"?"true":''
                        });
                    }
                });

                //转换语言
                //list.changeLan();
            },
        };
        List.init();
    });