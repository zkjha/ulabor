// zkj 2017/8/4
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
    var resourseList = {
        nowPage:'',
        init:function () {
            //获取当前登录人的身份信息
            resourseList.userType = $(".userType").attr("data-type");
            resourseList.event();
            resourseList.getPageToView(1);

        },
        event:function () {
            //manager设置资源共享点击事件
            $("#j_body").on("click",".shareSetting",function () {
                var id = $(this).attr("data-id");
                location.href="/admin/manage/resourse/shareSetting?strId="+id;

            })
            //pi设置具体资源是否可以共享
            $("#j_body").on("click",".shareBtn",function () {
                var _this = this;
                var iCanShare = $(this).attr("data-type");
                var strResourcesId = $(this).attr("data-id");
                Layer.loading();
                requstUtil.request({
                    url:'/admin/manage/ajaxResourse/piShareResource',
                    data:{
                        iCanShare:iCanShare,
                        strResourcesId:strResourcesId
                    },
                    callback:function (data) {
                        Layer.removeLoading();
                        if(data.code == 1){

                            resourseList.shareShow(strResourcesId,_this);
                            //刷新列表页面
                            resourseList.getPageToView(resourseList.nowPage)
                            // Layer.alert({
                            //     title:"alerCommon",
                            //     time:15000,
                            //     lan:resourseList.lan,
                            //     dom:parent.document.body,
                            //     name:"index"
                            // })
                            // alert("操作成功");
                        }else{
                            alert(data.msg);
                            return
                        }
                    }
                });
            })


            //绑定新增按钮点击事件
            $("#addResourse").on("click",function () {
               location.href="/admin/manage/resourse/addResourse";
            });


            //搜索资源按钮点击事件
            $("#searchBtn").on("click",function () {
                // Layer.layer({
                //     type:"layer",
                //     title:'test',
                //     url:"/admin/manage/resourse/resourseList"
                // });
                //获取搜索类型
                var strType = $("#search_select").val();
                //资源名称
                var  strName = $("#seach_input").val();
                resourseList.getPageToView(1,{
                    strType:strType,
                    strName:strName
                });
            })

            //入库点击事件
            $("#j_body").on("click",".storage_event",function () {
                var id= $(this).attr("data-id");
                //跳转到入库页面
                location.href = "/admin/manage/resourse/storage?strResourcesId="+id;
            });

            //监听topwindow的切换语言
            $(parent.document.body).on("change","#changLan_select",function (e) {
                var lan =resourseList.lan =  e.target.value;
                resourseList.changeLan(lan);
            });

        },
        //共享和取消共享的视图控制
        shareShow:function (selector,option) {
            //隐藏掉当前点击的按钮
            var allSpan = $("."+selector+"");
            allSpan.hide();
            $("."+selector+"").each(function (i,dom) {
                if(dom  !== option){
                    $(dom).show();
                }
            })
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
            resourseList.nowPage = nowPage;
            requstUtil.request({
               url:'/admin/manage/ajaxResourse/resourseList',
               data:option,
               callback:function (data) {
                   if(data.code == 1){
                       resourseList.createElement(data);
                   }else{
                       alert(data.msg);
                       return
                   }
               }
            });
        },
        createElement:function (dataList) {
            var datas = dataList.data||{};
            var list = datas.list||[];
            var str = "";
            for(var i = 0,l=list.length;i<l;i++){
                var data = list[i]||{};
                var dataId = data.strResourcesId||'';
                str +="<tr>";
                str +="<td>"+(data.strName||'')+"</td>";//资源名称
                switch (data.strType){
                    case "1":
                        str +="<td class='i18n' data-title='objectType1'>耗材</td>";
                        break;
                    case "2":
                        str +="<td class='i18n' data-title='objectType2'>试剂</td>";
                        break;
                    case "3":
                        str +="<td class='i18n' data-title='objectType3'>动物</td>";
                        break;
                    case "4":
                        str +="<td class='i18n' data-title='objectType4'>仪器</td>";
                        break;
                    default:
                        str+="<td></td>"

                };
                //str +="<td>"+(data.strType||'')+"</td>";//资源类型
                str +="<td>"+(data.strUnit||0)+"</td>";//单位

                str +="<td>"+(data.strSpecifications||'')+"</td>";//获取规格
                if(data.iIsShare == 1){
                    str +="<td class='sharing_td' ><span class='sharing i18n'  data-title='Shared'>共享中</span></td>";//是否共享
                }else{
                    str +="<td class='unShare_td'><span class='i18n unShare ' data-title='unShare'>不共享</span></td>";//是否共享
                }
                // str +="<td>"+(data.iIsShare||'')+"</td>";//是否共享
                str +="<td>"+(data.iNumber||0)+"</td>";//库存
                str +="<td>"+(data.strCompany||'')+"</td>";//公司品牌
                str +="<td>"+(data.strModel||'')+"</td>";//公司型号
                // str +="<td>"+(data.strPosition||'')+"</td>";//存放位置
                str +="<td>"+(data.strRemarks||'')+"</td>";//获取备注
                if(resourseList.userType == 2){
                    //pi
                    if(data.iCanShare == 0){
                        // str +="<td class='joinType_td groupType_td' style='text-align: center'><span class='joinType_td notInGroup groupType'><a href='#' class='storage_event i18n' data-title='actionName'  data-id='"+dataId+"'>入库</a></span>" +
                        //     "&nbsp&nbsp<span class=joinType_td notInGroup groupType''><a href='#'   class='shareBtn "+dataId+" i18n' data-type='1' data-title='shareTitle_share'  data-id='"+dataId+"'>共享</a></span>" +
                        //     "<span class='joinType_td notInGroup groupType'><a href='#' style='display: none' class='shareBtn "+dataId+" i18n ' data-type='0' data-title='shareTitle_cancel'  data-id='"+dataId+"'>取消共享</a></span>" +
                        //     "</td>";//操作
                        str +="<td class='joinType_td groupType_td' style='text-align: center'><span class='joinType_td notInGroup groupType storage_event i18n' data-title='actionName'  data-id='"+dataId+"'>入库</span>" +
                            "&nbsp&nbsp<span class='joinType_td notInGroup groupType shareBtn "+dataId+" i18n' data-type='1' data-title='shareTitle_share'  data-id='"+dataId+"'>共享</span>" +
                            "<span class='joinType_td notInGroup groupType shareBtn "+dataId+" i18n ' data-type='0' data-title='shareTitle_cancel'  data-id='"+dataId+"'  style='display: none' >取消共享</span>" +
                            "</td>";//操作
                    }else if(data.iCanShare == 1){
                        str +="<td class='joinType_td groupType_td' style='text-align: center'><span class='joinType_td notInGroup groupType storage_event i18n' data-title='actionName'  data-id='"+dataId+"'>入库</span>" +
                            "&nbsp&nbsp<span class='joinType_td notInGroup groupType shareBtn "+dataId+" i18n'  data-type='1' data-title='shareTitle_share'  data-id='"+dataId+"' style='display: none'>共享</span>" +
                            "<span class='joinType_td notInGroup groupType shareBtn "+dataId+" i18n '  data-type='0' data-title='shareTitle_cancel'  data-id='"+dataId+"'>取消共享</span>" +
                            "</td>";//操作
                    }
                }else{
                    if(data.iCanShare == 1){
                        //管理员
                        //资源可以共享时，显示共享设置。否则不显示共享设置
                        // str +="<td class='joinType_td groupType_td' style='text-align: center'><span class='joinType_td notInGroup groupType '><a href='#' class='storage_event i18n' data-title='actionName'  data-id='"+dataId+"'>入库</a></span>" +
                        //     "&nbsp&nbsp<span class='joinType_td notInGroup groupType'><a href='#'  class='shareSetting  i18n' data-title='shareTitle_setting'  data-id='"+dataId+"'>共享设置</a></span>"
                        //     "</td>";
                        str +="<td class='joinType_td groupType_td' style='text-align: center'><span class='joinType_td notInGroup groupType storage_event i18n' data-id='"+dataId+"' data-title='actionName'>入库</span>" +
                            "&nbsp&nbsp<span class='joinType_td notInGroup groupType shareSetting  i18n' data-title='shareTitle_setting' data-id='"+dataId+"'>共享设置</span>"
                            "</td>";
                    }else{
                        str +="<td   class='joinType_td groupType_td' style='text-align: center'><span class='joinType_td notInGroup groupType storage_event i18n' data-title='actionName'  data-id='"+dataId+"'>入库</span>" +
                            "</td>";
                    }
                }


                str +="</tr>"

            }
            $("#j_body").html(str);
            $("#j_footer").html("<span><span class='i18n' data-title='tips_one'>总共</span>&nbsp&nbsp"+dataList.data.iTotalpages+"&nbsp&nbsp<span class='i18n' data-title='pages'>页</span> ，<span class='i18n' data-title='tips_two'>当前为第</span>&nbsp&nbsp"+ resourseList.nowPage +"&nbsp&nbsp<span  class='i18n' data-title='pages'> 页</span></span>");
            $("#j_pageNum").html("");
            $("#j_pageNum").pagination({
                count: dataList.data.iTotalrecords, //总数
                size: 10, //每页数量
                index: resourseList.nowPage,//当前页
                lrCount: 3,//当前页左右最多显示的数量
                lCount: 1,//最开始预留的数量
                rCount: 1,//最后预留的数量
                callback: function (options) {
                    resourseList.getPageToView(options.index);
                }
            });

            //转换语言
            resourseList.changeLan();
        },
        changeLan:function (lan) {
            var lan  = resourseList.lan=lan||localStorage.getItem("lan");
            myi18n.common({
                name:"resourse",
                lan:lan
            })
        }

    }
    resourseList.init();
})