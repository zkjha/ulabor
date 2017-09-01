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
requirejs(["lib/jquery","lib/requstUtil","lib/layer","lib/jqueryPage","lib/bootstrap"],function ($,requstUtil,Layer) {
    var List = {
        init:function () {
            //获取当前查询的类型
            List.strReviewResult = $("#strReviewResult").val();
            List.event();
            List.getPage(1);

        },
        event:function () {
            //待审核点击事件
            $("#j_body").on("click",".action_span",function () {
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
            })

            //查询按钮点击事件
            $("#searchBtn").on("click",function () {
                List.strReviewResult = $("#strReviewResult").val();
                List.getPage(1);
            })




            // //新增按钮点击事件
            // $("#addResourse").on("click",function () {
            //     location.href="/superAdmin/manage/carousel/addNewCarousel"
            // })

        },
        getAgreeRequest:function (options) {
            requstUtil.request({
                url:"/superAdmin/manage/ajaxlaborManage/agreeOrRefuse",
                data:options,
                callback:function (data) {
                    if(data.code == 1){
                        alert("操作成功");
                        location.href = "/superAdmin/manage/laborManage/list";
                    }else{
                        // alert(data.msg);
                        return;
                    }
                }

            });
        },
        getPage:function (nowPage) {
            if(List.strReviewResult == "REVIEWREJECT"){
                $(".agree").hide();
                $(".refuse").show();
            }else{
                $(".refuse").hide();
                $(".agree").show();
            }
            $("#j_body").empty();
            $("#j_footer").empty();
            $("#j_pageNum").empty();
            var option = {
                pageSize:10,
                pageNumber:nowPage,
                strReviewResult:List.strReviewResult
            }
            List.nowPage = nowPage;
            requstUtil.request({
                url:'/superAdmin/manage/ajaxlaborManage/laborManage',
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
            var rootPath = datas.strImgRootPath||'';
            var list = datas.dataList||[];
            var str = "";
            if(List.strReviewResult == "REVIEWREJECT"){
               for(var i = 0,l=list.length;i<l;i++){
                   var data = list[i]||{};
                   var dataId = data.strReviewInfoId||'';
                   str +="<tr>";
                   str +="<td>"+(data.strNickName||'')+"</td>";//申请人姓名
                   str +="<td>"+(data.strUserPhone||'')+"</td>";//申请人电话
                   str +="<td>"+(data.strReviewNotes||'')+"</td>";//验证邮箱
                   str +="<td>"+(data.strCreateTime||'')+"</td>";//申请时间
                   str +="<td><span class='refuseGroup groupType_td  groupType i18n' data-title=''>审核拒绝</span></td>";//申请状态
                   str +="</tr>"

               }

            }else{

                for(var i = 0,l=list.length;i<l;i++){
                    var data = list[i]||{};
                    var dataId = data.strReviewInfoId||'';
                    str +="<tr>";
                    str +="<td>"+(data.strNickName||'')+"</td>";//申请人姓名
                    str +="<td>"+(data.strUserPhone||'')+"</td>";//申请人电话
                    str +="<td>"+(data.strReviewNotes||'')+"</td>";//验证邮箱
                    str +="<td>"+(data.strLaborName||'')+"</td>";//实验室名称
                    str +="<td>"+(data.strLaborParentUnit||'')+"</td>";//所属单位
                    str +="<td>"+(data.strLaborParentUnit||'')+"</td>";//实验室类型
                    str +="<td>"+(data.strCreateTime||'')+"</td>";//申请时间
                    //审核状态
                    switch (data.strReviewResult){
                        case "0":
                            str +="<td class='groupType_td' ><span class='notInGroup groupType i18n'  data-title='Shared'>未审核</span></td>";//是否审核
                            str +="<td class='groupType_td'><span class=' i18n action_span agree_group in_group' data-title='' data-id='"+dataId+"'>同意</span>" +
                                "<span class=' action_span i18n refuse_group in_group' data-title='' data-id='"+dataId+"'>拒绝</span></td>";//操作
                            break;
                        case "1":
                            str +="<td class='groupType_td' ><span class='groupType joinGroup i18n'  data-title='Shared'>审核通过</span></td>";//审核通过
                            str +="<td></td>"
                            break;
                        default:
                            str +="<td class='groupType_td' ><span class='groupType i18n'  data-title='Shared'></span></td>";
                            str +="<td class='groupType_td' ><span class='groupType i18n'  data-title='Shared'></span></td>";
                    }
                    str +="</tr>"

                }
            }
            $("#j_body").html(str);
            $("#j_footer").html("<span><span class='i18n' data-title='tips_one'>总共</span>&nbsp&nbsp"+dataList.data.iTotalpages+"&nbsp&nbsp<span class='i18n' data-title='pages'>页</span> ，<span class='i18n' data-title='tips_two'>当前为第</span>&nbsp&nbsp"+
                List.nowPage +"&nbsp&nbsp<span  class='i18n' data-title='pages'> 页</span></span>");
            $("#j_pageNum").html("");
            $("#j_pageNum").pagination({
                count: dataList.data.iTotalrecords, //总数
                size: 10, //每页数量
                index: List.nowPage,//当前页
                lrCount: 3,//当前页左右最多显示的数量
                lCount: 1,//最开始预留的数量
                rCount: 1,//最后预留的数量
                callback: function (options) {
                    List.getPage(options.index);
                }
            });

            //转换语言
            // list.changeLan();
        },
    };
    List.init();
})