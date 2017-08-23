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
           List.event();
           List.getPage(1)
       },
       event:function () {
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
               pageNumber:nowPage
           }
           List.nowPage = nowPage;
           requstUtil.request({
               url:'/superAdmin/manage/ajaxCarousel/carouselList',
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
           var list = datas.carouselList||[];
           var str = "";
           for(var i = 0,l=list.length;i<l;i++){
               var data = list[i]||{};
               var dataId = data.strCarouselID||'';
               str +="<tr>";
               str +="<td><img class='showImg' src='"+(rootPath+data.strAddress)+"'/></td>";//图片
               switch (data.strType){
                   case "1":
                       str +="<td class='i18n colorSpan_td ' data-title='objectType1'><span class='colorSpan_green i18n lineheight50' data-title=''>轮播图</span></td>";
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
                       str+="<td class='colorSpan_td lineheight50'><span class='colorSpan_blue i18n lineheight50' data-title=''>其他</span></td>"

               };
               if(data.iIsDelete == 0){//是否显示
                    str +="<td class='i18n colorSpan_td lineheight50' data-title=''><span class='colorSpan_green  i18n lineheight50' data-title=''>显示</span></td>"

               }else{
                   str +="<td class='i18n colorSpan_td lineheight50' data-title=''><span class='colorSpan_red i18n  lineheight50' data-title=''></span></td>"

               }
               str +="<td style='text-align: center' class='colorSpan_td lineheight50'><span class='action_span iIsDelete i18n lineheight50' data-title='' data-id='"+dataId+"'>删除</span></td>";

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
           // list.changeLan();
       },
   };
   List.init();
})