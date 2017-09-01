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
        },
        "lib/webuploader":{
            deps:['lib/jquery']
        }
    }
});
requirejs(['lib/jquery','lib/layer',"lib/requstUtil",'lib/myi18n',"lib/webuploader","lib/jqueryPage","lib/bootstrap"],
    function ($,Layer,requstUtil,myi18n,WebUploader) {
    var resourseList = {
        nowPage:'',
        init:function () {
            //获取当前页面的type
            resourseList.strType = location.href.split("?")[1];
            //根据当前的页面的type来更改相应的表格顶部的
            // resourseList.changeTitle();

            //获取当前登录人的身份信息
            resourseList.userType = $(".userType").attr("data-type");
            resourseList.event();
            resourseList.getPageToView(1);
            resourseList.initUploadFile();

        },
        event:function () {
            //批量导入按钮点击事件
            $("#addResourse_all").on('click',function () {
                resourseList.uploadFile();
            })

            //manager设置资源共享点击事件
            $("#j_body").on("click",".shareSetting",function () {
                var id = $(this).attr("data-id");
                var num = $(this).attr("data-number");
                //当前
                var strType = resourseList.strType;
                location.href="/admin/manage/resourse/shareSetting?strId="+(id+","+num+","+strType);

            });

            //manager设置资源取消共享动作
            $("#j_body").on("click",".cancelShare",function () {
               var id = $(this).attr("data-id");
               requstUtil.request({
                   url:"/admin/manage/ajaxResourse/cancelShare",
                   data:{
                       strResourcesId:id
                   },
                   callback:function (data) {
                       if(data.code == 1){
                           alert("操作成功");
                           location.href=""
                       }else{
                           alert(data.msg);
                           return
                       }
                   }
               })
            });


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
               location.href="/admin/manage/resourse/addResourse?"+resourseList.strType;
            });


            //搜索资源按钮点击事件
            $("#searchBtn").on("click",function () {
                // Layer.layer({
                //     type:"layer",
                //     title:'test',
                //     url:"/admin/manage/resourse/resourseList"
                // });
                //获取搜索类型
                // var strType = $("#search_select").val();
                //资源名称
                var  strName = $("#seach_input").val();
                resourseList.getPageToView(1,{
                    strName:strName
                });
            })

            //入库点击事件
            $("#j_body").on("click",".storage_event",function () {
                var id= $(this).attr("data-id");
                //跳转到入库页面
                location.href = "/admin/manage/resourse/storage?strResourcesId="+id+","+resourseList.strType;
            });

            //监听topwindow的切换语言
            $(parent.document.body).on("change","#changLan_select",function (e) {
                // Layer.loading();
                var lan =resourseList.lan =  e.target.value;
                // resourseList.changeLan(lan);
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
                pageNumber:nowPage,
                strType:resourseList.strType
            }
            if(options){
                for(var i in options){
                    option[i] = options[i];
                }
            }
            resourseList.nowPage = nowPage;
            requstUtil.request({
               url:'/admin/manage/ajaxResourse/resourseList?'+resourseList.strType,
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
                if(data.iCanShare ==0 ){
                    //如果pi设置为不能共享，则显示未共享
                    str +="<td class='unShare_td'><span class='i18n unShare ' data-title='unShare'>未共享</span></td>";//是否共享
                }else{
                    if(data.iIsShare == 1){
                        str +="<td class='sharing_td' ><span class='sharing i18n'  data-title='Shared'>共享中</span></td>";//是否共享
                    }else{
                        str +="<td class='unShare_td'><span class='i18n unShare ' data-title='unShare'>未共享</span></td>";//是否共享
                    }
                }

                // str +="<td>"+(data.iIsShare||'')+"</td>";//是否共享
                str +="<td>"+(data.iNumber||0)+"</td>";//库存
                str +="<td>"+(data.strCompany||'')+"</td>";//公司品牌
                str +="<td>"+(data.strModel||'')+"</td>";//公司型号
                // str +="<td>"+(data.strPosition||'')+"</td>";//存放位置
                str +="<td>"+(data.strRemarks||'')+"</td>";//获取备注
                if(resourseList.userType == 2){
                    //pi
                    //pi是能设置该资源是否可以共享，字段是icanshare，具体是否共享由管理员操作

                    if(data.iCanShare == 0){
                        //设置共享
                        // str +="<td class='joinType_td groupType_td' style='text-align: center'><span class='joinType_td notInGroup groupType'><a href='#' class='storage_event i18n' data-title='actionName'  data-id='"+dataId+"'>入库</a></span>" +
                        //     "&nbsp&nbsp<span class=joinType_td notInGroup groupType''><a href='#'   class='shareBtn "+dataId+" i18n' data-type='1' data-title='shareTitle_share'  data-id='"+dataId+"'>共享</a></span>" +
                        //     "<span class='joinType_td notInGroup groupType'><a href='#' style='display: none' class='shareBtn "+dataId+" i18n ' data-type='0' data-title='shareTitle_cancel'  data-id='"+dataId+"'>取消共享</a></span>" +
                        //     "</td>";//操作
                        str +="<td class='joinType_td groupType_td' style='text-align: center'><span class=' joinType_td notInGroup groupType storage_event i18n' data-title='actionName'  data-id='"+dataId+"'>入库</span>" +
                            "&nbsp&nbsp<span class=' joinType_td notInGroup groupType shareBtn "+dataId+" i18n' data-type='1' data-title='shareTitle_share'  data-id='"+dataId+"'>共享</span>" +
                            "<span class=' joinType_td notInGroup groupType shareBtn "+dataId+" i18n ' data-type='0' data-title='shareTitle_cancel'  data-id='"+dataId+"'  style='display: none' >取消共享</span>" +
                            "</td>";//操作
                    }else if(data.iCanShare == 1){
                        //取消共享
                        str +="<td class='joinType_td groupType_td' style='text-align: center'><span class=' joinType_td notInGroup groupType storage_event i18n' data-title='actionName'  data-id='"+dataId+"'>入库</span>" +
                            "&nbsp&nbsp<span class=' joinType_td notInGroup groupType shareBtn "+dataId+" i18n'  data-type='1' data-title='shareTitle_share'  data-id='"+dataId+"' style='display: none'>共享</span>" +
                            "<span class=' joinType_td notInGroup groupType shareBtn "+dataId+" i18n '  data-type='0' data-title='shareTitle_cancel'  data-id='"+dataId+"'>取消共享</span>" +
                            "</td>";//操作
                    }
                }else{
                    if(data.iCanShare == 1){
                        //管理员
                        //资源可以共享时，显示共享设置。否则不显示共享设置
                        // str +="<td class='joinType_td groupType_td' style='text-align: center'><span class='joinType_td notInGroup groupType '><a href='#' class='storage_event i18n' data-title='actionName'  data-id='"+dataId+"'>入库</a></span>" +
                        //     "&nbsp&nbsp<span class='joinType_td notInGroup groupType'><a href='#'  class='shareSetting  i18n' data-title='shareTitle_setting'  data-id='"+dataId+"'>共享设置</a></span>"
                        //     "</td>";


                        //根据当前资源的共享状态来设置共享设置或者取消共享
                        if(data.iIsShare == 1){
                            //当前状态为为共享
                            str +="<td class='joinType_td groupType_td' style='text-align: center'><span class='btn joinType_td notInGroup groupType storage_event i18n' data-id='"+dataId+"' data-title='actionName'>入库</span>" +
                                "&nbsp&nbsp<span class='btn joinType_td notInGroup groupType cancelShare  i18n' data-title='shareTitle_setting'data-number='"+data.iNumber+"' data-id='"+dataId+"'>取消共享</span>"
                            "</td>";
                        }else{
                            str +="<td class='joinType_td groupType_td' style='text-align: center'><span class='btn joinType_td notInGroup groupType storage_event i18n' data-id='"+dataId+"' data-title='actionName'>入库</span>" +
                                "&nbsp&nbsp<span class='btn joinType_td notInGroup groupType shareSetting  i18n' data-title='shareTitle_setting'data-number='"+data.iNumber+"' data-id='"+dataId+"' >共享设置</span>"
                            "</td>";
                        }


                    }else{
                        // str +="<td   class='joinType_td groupType_td' style='text-align: center'><span class=' joinType_td notInGroup groupType storage_event i18n' data-title='actionName'  data-id='"+dataId+"'>入库</span>" +
                        //     "</td>";

                        if(data.iIsShare == 1){
                            //当前状态为为共享
                            str +="<td class='joinType_td groupType_td' style='text-align: center'><span class='btn joinType_td notInGroup groupType storage_event i18n' data-id='"+dataId+"' data-title='actionName'>入库</span>" +
                                "&nbsp&nbsp<span class=' joinType_td  groupType  i18n btn notInGroup' data-title='shareTitle_setting' data-number='"+data.iNumber+"' data-id='"+dataId+"' disabled='disabled'>取消共享</span>"+
                            "</td>";
                        }else{
                            str +="<td class='joinType_td groupType_td' style='text-align: center'><span class='btn joinType_td notInGroup groupType storage_event i18n' data-id='"+dataId+"' data-title='actionName'>入库</span>" +
                                "&nbsp&nbsp<span class=' joinType_td  groupType   i18n btn notInGroup ' data-title='shareTitle_setting' data-number='"+data.iNumber+"' data-id='"+dataId+"' disabled='disabled'>共享设置</span>"+
                            "</td>";
                        }
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
            // resourseList.changeLan();
        },
        // changeLan:function (lan) {
        //     var lan  = resourseList.lan=lan||localStorage.getItem("lan");
        //     myi18n.common({
        //         name:"resourse",
        //         lan:lan
        //     })
        // },
        initUploadFile:function () {
            jQuery(function() {
                var $ = jQuery,
                    $list = $('#thelist'),
                    $btn = $('#ctlBtn'),
                    state = 'pending',
                    uploader;

                uploader = WebUploader.create({
                    //同一文件重复上传
                    duplicate :true,

                    // 不压缩image
                    resize: false,

                    // 文件接收服务端。
                    server: '/admin/manage/upload/uploadFile?strType='+resourseList.strType,

                    // 选择文件的按钮。可选。
                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                    pick: '#picker',
                    accept:{
                        title: 'File',
                        extensions: 'xlsx,xls',
                        mimeTypes: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                });

                // 当有文件添加进来的时候
                uploader.on( 'fileQueued', function( file ) {
                    $list.append( '<div id="' + file.id + '" class="item">' +
                        '<h4 class="info">' + file.name + '</h4>' +
                        '<p class="state">等待上传...</p>' +
                        '</div>' );
                });

                // 文件上传过程中创建进度条实时显示。
                uploader.on( 'uploadProgress', function( file, percentage ) {
                    var $li = $( '#'+file.id ),
                        $percent = $li.find('.progress .progress-bar');

                    // 避免重复创建
                    if ( !$percent.length ) {
                        $percent = $('<div class="progress progress-striped active">' +
                            '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                            '</div>' +
                            '</div>').appendTo( $li ).find('.progress-bar');
                    }

                    $li.find('p.state').text('上传中');

                    $percent.css( 'width', percentage * 100 + '%' );
                });

                uploader.on( 'uploadSuccess', function( file,response) {
                    Layer.removeLoading();
                    var data = response.data||{};
                    var url = data.filePath,rootUrl=data.strRootpath;
                    //如果返回状态不为1，提醒错误
                    if(response.code == 1){
                        if(url){
                            var errImg = $("#errImg");
                            //如果返回值有url,则显示按钮
                            errImg.html("<a href='"+(rootUrl+url)+"'>导入资源部分失败，查看原因</a>")
                            // $("#errImg").show();

                        }else{
                            alert("操作成功");
                            location.href="/admin/manage/resourse/resourseList?"+resourseList.strType;
                        }
                    }else{
                        alert(response.msg);
                        return
                    }


                });

                uploader.on( 'uploadError', function( file ) {
                    Layer.removeLoading();
                });

                uploader.on( 'uploadComplete', function( file ,data) {
                    console.log(data);
                    $( '#'+file.id ).find('.progress').fadeOut();
                });
                uploader.on( 'all', function( type ) {
                    if ( type === 'startUpload' ) {
                        state = 'uploading';
                    } else if ( type === 'stopUpload' ) {
                        state = 'paused';
                    } else if ( type === 'uploadFinished' ) {
                        state = 'done';
                    }

                    if ( state === 'uploading' ) {
                        $btn.text('暂停上传');
                    } else {
                        $btn.text('开始上传');
                    }
                });


                $btn.on( 'click', function() {
                    if ( state === 'uploading' ) {
                        uploader.stop();
                    } else {
                        uploader.upload();
                    }
                });
            });
        },
        uploadFile:function () {
            $("#errImg").html("");
            var $btn = $('#ctlBtn')
            var pickerDom = document.getElementById("picker");
            if(!pickerDom){
                var time = setTimeout(function () {
                    clearTimeout(time);
                    if(pickerDom){
                        time = "";
                        $("#picker input").click();
                        $("#picker input").on("change",function () {
                            Layer.loading();
                            $btn.click();
                        })
                    }
                },100);
            }else{
                $("#picker input").click();
                $("#picker input").on("change",function () {
                    Layer.loading();
                    $btn.click();
                })
            }
        }


    }
    resourseList.init();
})