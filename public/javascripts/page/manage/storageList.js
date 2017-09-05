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
requirejs(["lib/jquery","lib/requstUtil","lib/layer",'lib/myi18n',"lib/jqueryPage","lib/bootstrap"],
    function ($,requstUtil,Layer,myi18n) {
    var List = {
        init:function () {
            //获取资源id和当前资源类型
            var search = location.href.split("?")[1];
            //第一个参数为资源id，第二个为类型
            List.strResourcesId = search.split(",")[0];
            List.strType = search.split(",")[1];
            List.event();
            List.getPage(1)
        },
        event:function () {
            //新增入库按钮点击事件
            $("#addResourse").on("click",function () {
                location.href = "/admin/manage/resourse/storage?strResourcesId="+List.strResourcesId+","+List.strType;
            });
            $(parent.document.body).on("change","#changLan_select",function (e) {
                // Layer.loading();
                var lan =List.lan =  e.target.value;
                List.changeLan(lan);
            });

        },
        getPage:function (nowPage) {
            var option = {
                pageSize:10,
                pageNumber:nowPage,
                strResourcesId:List.strResourcesId
            }
            List.nowPage = nowPage;
            requstUtil.request({
                url:'/admin/manage/ajaxResourse/getStorageList',
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
            for(var i = 0,l=list.length;i<l;i++){
                var data = list[i]||{};
                var dataId = data.strCarouselID||'';
                str +="<tr>";
                str +="<td>"+(data.strName||"")+"</td>";//资源名称
                str +="<td>"+(data.strDealer||"")+"</td>";//经销商
                str +="<td>"+(data.strComeFrome||"")+"</td>";//来源
                str +="<td>"+(data.decMoney||"")+"</td>";//入库单价
                str +="<td>"+(data.iNumber||"")+"</td>";//入库数量
                str +="<td>"+(data.strVoucher||"")+"</td>";//凭证
                str +="<td>"+(data.strRemarks||"")+"</td>";//备注信息
                str +="<td>"+(data.strProductionDate||"")+"</td>";//时间
                // switch (data.strType){
                //     case "1":
                //         str +="<td class='i18n' data-title='objectType2'>耗材</td>";
                //         break;
                //     case "2":
                //         str +="<td class='i18n' data-title='objectType2'>试剂</td>";
                //         break;
                //     case "3":
                //         str +="<td class='i18n' data-title='objectType3'>动物</td>";
                //         break;
                //     case "4":
                //         str +="<td class='i18n' data-title='objectType4'>仪器</td>";
                //         break;
                //     default:
                //         str+="<td class='colorSpan_td lineheight50'><span class='colorSpan_blue i18n lineheight50' data-title=''>其他</span></td>"
                //
                // };
                // if(data.iIsDelete == 0){//是否显示
                //     str +="<td class='i18n colorSpan_td lineheight50' data-title=''><span class='colorSpan_green  i18n lineheight50' data-title=''>显示</span></td>"
                //
                // }else{
                //     str +="<td class='i18n colorSpan_td lineheight50' data-title=''><span class='colorSpan_red i18n  lineheight50' data-title=''></span></td>"
                //
                // }
                // str +="<td style='text-align: center' class='colorSpan_td lineheight50'><span class='action_span iIsDelete i18n lineheight50' data-title='' data-id='"+dataId+"'>删除</span></td>";

                str +="</tr>"

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
            List.changeLan();
        },
        changeLan:function (lan) {
            var lan  = List.lan=lan||localStorage.getItem("lan");
            myi18n.common({
                name:"resourse",
                lan:lan
            })
        },
    };
    List.init();
})