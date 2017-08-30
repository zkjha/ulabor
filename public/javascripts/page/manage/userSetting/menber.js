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
                //获取当前登录人身份
                List.event();
                List.getPageToView(1);
            },
            event:function () {

                //监听踢出事件
                $("#j_body").on("click",".in_group",function () {
                    var User_Id = $(this).attr("data-id");
                    List.getAgreeRequest({
                        strUserinfoId:User_Id
                    })
                });




            },
            getAgreeRequest:function (options) {
                requstUtil.request({
                    url:"/admin/manage/ajaxUserSetting/removeMenber",
                    data:options,
                    callback:function (data) {
                        if(data.code == 1){
                            alert("操作成功");
                            location.href = "/admin/manage/userSetting/menberManage";
                        }else{
                            alert(data.msg);
                            return;
                        }
                    }

                });
            },
            getPageToView:function (nowPage,options) {
                // var option = {
                //     pageSize:10,
                //     pageNumber:nowPage
                // }
                // if(options){
                //     for(var i in options){
                //         option[i] = options[i];
                //     }
                // }
                // List.nowPage = nowPage;
                requstUtil.request({
                    url:'/admin/manage/ajaxUserSetting/getAllMenbers',
                    data:{},
                    callback:function (data) {
                        if(data.code == 1){
                            console.log(data.data);
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
                var root = datas.strImgRootPath;
                // var userInfo = dataList.userInfo||{};
                var list = datas.list||[];
                var str = "",isPI;
                if(dataList.userType == 2){
                    isPI = true;
                }
                for(var i = 0,l=list.length;i<l;i++){
                    var data = list[i]||{};
                    var dataId = data.strUserinfoId||'';
                    str +="<tr>";
                    str +="<td><img class='userImg' src='"+(root+data.strHeadImage)+"'></td>";//头像
                    str +="<td>"+(data.strNickName||'')+"</td>";//姓名
                    str +="<td>"+(data.strUserPhone?(((data.strRegionNumber||'')+" "+(data.strUserPhone||''))):(data.strUserEmail||''))+"</td>";//电话
                    str +="<td>"+(data.strregisterTime||"")+"</td>";//申请时间
                    switch (data.strUserType){//状态
                        case '0':
                            str +="<td class='joinType_td groupType_td ' ><span class='joinType_td notInGroup groupType i18n'  data-title='Shared'>成员 </span></td>";//是否加入
                            str +="<td><span class=' i18n action_span agree_group in_group joinType_td' data-title='' data-id='"+dataId+"'>踢出</span></td>"
                            break;
                        case '1':
                            str +="<td class='joinType_td groupType_td ' ><span class='joinType_td groupType joinGroup i18n'  data-title='Shared'>管理员</span></td>";//是否加入
                            if(isPI){
                                str +="<td><span class=' i18n action_span agree_group in_group joinType_td' data-title='' data-id='"+dataId+"'>踢出</span></td>"
                            }else{
                                str +="<td></td>"
                            }
                            break;
                        case '2':
                            str +="<td class='joinType_td groupType_td ' ><span class='joinType_td groupType refuseGroup i18n'  data-title='Shared'>PI </span></td>";//是否加入
                            str +="<td class='joinType_td groupType_td ' ></td>";//是否加入
                            break;
                        default:
                            str +="<td class='joinType_td groupType_td ' ><span class='joinType_td notInGroup groupType i18n'  data-title='Shared'>成员</span></td>";
                            str +="<td><span class=' i18n action_span agree_group in_group joinType_td' data-title='' data-id='"+dataId+"'>踢出</span>"
                    }
                    //获取用户信息用来处理不同操作



                    str +="</tr>"

                }
                $("#j_body").html(str);
                // $("#j_footer").html("<span><span class='i18n' data-title='tips_one'>总共</span>&nbsp&nbsp"+dataList.data.iTotalpages+"&nbsp&nbsp<span class='i18n' data-title='pages'>页</span> ，<span class='i18n' data-title='tips_two'>当前为第</span>&nbsp&nbsp"+ List.nowPage +"&nbsp&nbsp<span  class='i18n' data-title='pages'> 页</span></span>");
                // $("#j_pageNum").html("");
                // $("#j_pageNum").pagination({
                //     count: dataList.data.iTotalrecords, //总数
                //     size: 10, //每页数量
                //     index: List.nowPage,//当前页
                //     lrCount: 3,//当前页左右最多显示的数量
                //     lCount: 1,//最开始预留的数量
                //     rCount: 1,//最后预留的数量
                //     callback: function (options) {
                //         List.getPageToView(options.index,{
                //             strReviewResult:list.strReviewResult,
                //             strIsHadReview:List.strIsHadReview == "true"?"true":''
                //         });
                //     }
                // });

                //转换语言
                //list.changeLan();
            },
        };
        List.init();
    });