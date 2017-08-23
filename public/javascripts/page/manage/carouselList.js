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
requirejs(["lib/jquery","lib/requstUtil","lib/jqueryPage","lib/bootstrap"],function ($,requstUtil) {
   var list = {
       init:function () {
           list.event();
           list.getPage(1)
       },
       event:function () {

       },
       getPage:function (nowPage) {
           var option = {
               pageSize:10,
               pageNumber:nowPage
           }
           list.nowPage = nowPage;
           requstUtil.request({
               url:'/admin/manage/ajaxCarousel/carouselList',
               data:option,
               callback:function (data) {
                   if(data.code == 1){
                       list.createElement(data);
                   }else{
                       alert(data.msg);
                       return
                   }
               }
           });
       },
       createElement:function (dataList) {
           var rootPath = dataList.strImgRootPath;
           var datas = dataList.data||{};
           var list = datas.list||[];
           var str = "";
           for(var i = 0,l=list.length;i<l;i++){
               var data = list[i]||{};
               var dataId = data.strResourcesId||'';
               str +="<tr>";
               str +="<td><img src='"+(strImgRootPath+data.strAddress)+"'/></td>";//图片
               switch (data.strType){
                   case "1":
                       str +="<td class='i18n' data-title='objectType1'>轮播图</td>";
                       break;
                   // case "2":
                   //     str +="<td class='i18n' data-title='objectType2'>试剂</td>";
                   //     break;
                   // case "3":
                   //     str +="<td class='i18n' data-title='objectType3'>动物</td>";
                   //     break;
                   // case "4":
                   //     str +="<td class='i18n' data-title='objectType4'>仪器</td>";
                   //     break;
                   default:
                       str+="<td>其他</td>"

               };
               if(data.iIsDelete&&data.iIsDelete == 0){//是否显示
                    str +="<td class='i18n' data-title=''>显示</td>"
               }else{
                   str +="<td class='i18n' data-title=''>不显示</td>"
               }
               str +="<td style='text-align: center'><span class=''><a href='#' class='storage_event i18n' data-title='actionName'  data-id='\"+dataId+\"'>入库</a></span></td>";
               str +="</tr>"

           }
           $("#j_body").html(str);
           $("#j_footer").html("<span><span class='i18n' data-title='tips_one'>总共</span>&nbsp&nbsp"+dataList.data.iTotalpages+"&nbsp&nbsp<span class='i18n' data-title='pages'>页</span> ，<span class='i18n' data-title='tips_two'>当前为第</span>&nbsp&nbsp"+ list.nowPage +"&nbsp&nbsp<span  class='i18n' data-title='pages'> 页</span></span>");
           $("#j_pageNum").html("");
           $("#j_pageNum").pagination({
               count: dataList.data.iTotalrecords, //总数
               size: 10, //每页数量
               index: list.nowPage,//当前页
               lrCount: 3,//当前页左右最多显示的数量
               lCount: 1,//最开始预留的数量
               rCount: 1,//最后预留的数量
               callback: function (options) {
                   list.getPageToView(options.index);
               }
           });

           //转换语言
           // list.changeLan();
       },
   };
   list.init();
})