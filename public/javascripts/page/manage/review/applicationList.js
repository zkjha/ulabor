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
                    List.getPageToView(1);
                },
                event:function () {

                    //监听顶部语言切换事件
                    $(parent.document.body).on("change","#changLan_select",function (e) {
                        // Layer.loading();
                        var lan =List.lan =  e.target.value;
                        List.changeLan(lan);
                    });

                    //监听查询按钮点击事件
                    $("#searchBtn").on("click",function () {
                        //获取审核状态及申请状态值，如果审核状态值为true，则，不在获取申请状态
                        List.strIsHadReview = $("#strIsHadReview").val();
                        if(List.strIsHadReview){
                            List.getPageToView(1,{strIsHadReview:"true"});
                        }else{
                            List.strReviewResult = $("#strReviewResult").val();
                            List.getPageToView(1,{strReviewResult:List.strReviewResult})
                        }
                    })


                    //监听同意加入和拒绝加入分组点击事件
                    $("#j_body").on("click",".in_group",function () {
                        var strReviewInfoId = $(this).attr("data-id");
                        var strReviewResult = "",strReviewNotes;
                        if($(this).hasClass("agree_group")){
                            //同意按钮点击事件
                            strReviewResult = 'REVIEWPASS';
                            List.getAgreeRequest({
                                strReviewInfoId:strReviewInfoId,
                                strReviewResult:strReviewResult
                            })
                        }else{
                            //拒绝按钮点击事件
                            strReviewResult = 'REVIEWREJECT';
                            Layer.layer({
                                type:"search",
                                title:'请输入拒绝理由',
                                callback:function (datas) {
                                    strReviewNotes = datas;
                                    List.getAgreeRequest({
                                        strReviewInfoId:strReviewInfoId,
                                        strReviewResult:strReviewResult,
                                        strReviewNotes:strReviewNotes
                                    })
                                }
                            });
                        }

                    });




                },
                getAgreeRequest:function (options) {
                    requstUtil.request({
                        url:"/admin/manage/ajaxReview/agree",
                        data:options,
                        callback:function (data) {
                            if(data.code == 1){
                                alert("操作成功");
                                location.href = "/admin/manage/review/applicationList";
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
                        url:'/admin/manage/ajaxReview/joinList',
                        data:option,
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
                    var list = datas.dataList||[];
                    var str = "";
                    for(var i = 0,l=list.length;i<l;i++){
                        var data = list[i]||{};
                        var dataId = data.strReviewInfoId||'';
                        str +="<tr>";
                        str +="<td><img class='userImg' src='"+(root+data.strHeadImage)+"'></td>";//头像
                        str +="<td>"+(data.strNickName||'')+"</td>";//姓名
                        str +="<td>"+(data.strUserEmail?data.strUserEmail:(data.strRegionNumber+" "+data.strUserPhone||''))+"</td>";//电话
                        str +="<td>"+(data.strCreateTime||"")+"</td>";//申请时间
                        switch (data.strReviewResult){//状态
                            case '0':
                                str +="<td class='joinType_td groupType_td ' ><span class='joinType_td notInGroup groupType i18n'  data-title='Auditing'>审核中</span></td>";//是否加入
                                break;
                            case '1':
                                str +="<td class='joinType_td groupType_td ' ><span class='joinType_td groupType joinGroup i18n'  data-title='agree'>已通过</span></td>";//是否加入
                                break;
                            case '-1':
                                str +="<td class='joinType_td groupType_td ' ><span class='joinType_td groupType refuseGroup i18n'  data-title='refuse'>已拒绝</span></td>";//是否加入
                                break;
                            default:
                                str +="<td class='joinType_td groupType_td ' ><span class='joinType_td notInGroup groupType i18n'  data-title='Auditing'>审核中</span></td>";
                        }
                        //获取用户信息用来处理不同操作

                        //如果还没有加入，则只能处理是否加入
                        if(data.strReviewResult == 0){
                            str +="<td style='line-height: 50px'><span class='btn imgaction i18n action_span agree_group in_group joinType_td' data-title='actionAgree' data-id='"+dataId+"'>同意</span>" +
                                "<span class='btn imgaction action_span i18n refuse_group in_group joinType_td' data-title='actionRefuse' data-id='"+dataId+"'>拒绝</span>"
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
                            str+="<td>"


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
                            List.getPageToView(options.index,{
                                strReviewResult:List.strReviewResult,
                                strIsHadReview:List.strIsHadReview == "true"?"true":''
                            });
                        }
                    });

                    //转换语言
                    List.changeLan();
                },
                changeLan:function (lan) {
                    var lan  = List.lan=(lan||localStorage.getItem("lan"));
                    myi18n.common({
                        name:"audit",
                        lan:lan
                    })
                }
        };
        List.init();
});