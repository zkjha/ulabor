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
            List.getPage(1)
        },
        event:function () {
            if(List.strReviewResult == "REVIEWREJECT"){
                $(".agree").hide();
                $(".refuse").show();
            }else{
                $(".refuse").hide();
                $(".agree").show();
            }
            //监听点击删除按钮
            $("#j_body").on("click",".iIsDelete",function () {
                Layer.loading();
                var strCarouselID = $(this).attr("data-id");
                var iIsDelete = -1;
                requstUtil.request({
                    url:'/superAdmin/manage/ajaxCarousel/delete',
                    data:{
                        strCarouselID:strCarouselID,
                        iIsDelete:iIsDelete
                    },
                    callback:function (data) {
                        Layer.removeLoading();
                        if(data.code == 1){
                            //alert("操作成功");
                            location.href = "/superAdmin/manage/carousel/carouselList";
                        }else{
                            alert(data.msg);
                            return
                        }

                    }
                })
            });


            //新增按钮点击事件
            $("#addResourse").on("click",function () {
                location.href="/superAdmin/manage/carousel/addNewCarousel"
            })

        },
        getPage:function (nowPage) {
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
                   str +="<td><span class='notInGroup groupType i18n' data-title=''>审核拒绝</span></td>";//申请状态
                   str +="</tr>"

               }

            }else{

                for(var i = 0,l=list.length;i<l;i++){
                    var data = list[i]||{};
                    var dataId = data.strReviewInfoId||'';
                    str +="<tr>";
                    str +="<td>"+(data.strLaborName||'')+"</td>";//实验室名称
                    str +="<td>"+(data.strLaborParentUnit||'')+"</td>";//所属单位
                    str +="<td>"+(data.strNickName||'')+"</td>";//创建者姓名
                    str +="<td>"+(data.strUserPhone||'')+"</td>";//创建者电话
                    str +="<td>"+(data.strCreateTime||'')+"</td>";//申请时间
                    //审核状态
                    switch (data.strReviewResult){
                        case 0:
                            str +="<td class='groupType_td' ><span class='notInGroup groupType i18n'  data-title='Shared'>未审核</span></td>";//是否审核
                            str +="<td><span class=' i18n action_span agree_group in_group' data-title='' data-id='"+data.strGroupAndLaboratoryId+"'>同意</span>" +
                                "<span class=' action_span i18n refuse_group in_group' data-title='' data-id='"+data.strGroupAndLaboratoryId+"'>拒绝</span>";//操作
                            break;
                        case 1:
                            str +="<td class='groupType_td' ><span class='groupType joinGroup i18n'  data-title='Shared'>审核通过</span></td>";//审核通过
                            str +="<td></td>"
                            break;
                        case -1:
                            str +="<td class='groupType_td' ><span class='groupType refuseGroup i18n'  data-title='Shared'>审核拒绝</span></td>";//审核拒绝
                            str +="<td></td>"
                            break;
                        default:
                            str +="<td class='groupType_td' ><span class='groupType i18n'  data-title='Shared'></td>";
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