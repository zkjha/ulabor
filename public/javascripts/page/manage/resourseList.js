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
            resourseList.event();
            resourseList.getPageToView(1);

        },
        event:function () {
            //绑定新增按钮点击事件
            $("#addResourse").on("click",function () {
               location.href="/admin/manage/resourse/addResourse";
            });


            //搜索资源按钮点击事件
            $("#searchBtn").on("click",function () {
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
                var lan = e.target.value;
                resourseList.changeLan(lan);
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
                str +="<td>"+(data.decMoney||'')+"</td>";//单价
                str +="<td>"+(data.iNumber||0)+"</td>";//库存
                str +="<td>"+(data.strCompany||'')+"</td>";//公司品牌
                str +="<td>"+(data.strModel||'')+"</td>";//公司型号
                // str +="<td>"+(data.strPosition||'')+"</td>";//存放位置
                str +="<td>"+(data.strRemarks||'')+"</td>";//获取备注
                str +="<td style='text-align: center'><span class=''><a href='#' class='storage_event i18n' data-title='actionName'  data-id='"+dataId+"'>入库</a></span></td>";//操作

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
            var lan  = lan||localStorage.getItem("lan");
            myi18n.common({
                name:"resourse",
                lan:lan
            })
        }

    }
    resourseList.init();
})