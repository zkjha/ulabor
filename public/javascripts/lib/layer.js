require.config({
    baseUrl : GV.STATIC_ROOT + "javascripts",

});
define(
    [ 'lib/jquery','lib/myi18n'],
    function($,myi18n) {
        var layer={
            showDom:[],

            alert:function(options,time,lan,dom){
                //options:对象或者字符串，如果为字符串时为title，title是国际化文件中的属性名称，去对应的值做弹出窗的内容
                //time：展现时间
                //lan:为弹出窗口语言
                //dom 为再那个节点展示弹窗，默认为当前窗口
                //msg 为国际化文件中对应内容的属性名
                //传参的两种方式
                //1.{
                //      title:'',
                //      lan:'',
                //      time:'',
                //      name:'' 国际化文件的名字，如main.propertyps的话name 为main
                // }
                //2 options:string(titile),time,lan
                var title,time;

                if(typeof  options =="object"){
                    title = options.title;
                    time = options.time||2000;
                }else{
                    title = options||null;
                    time = time||2000;
                }
                var lan = options.lan||lan||'zh';//选择展示语言，默认为zh
                var rootDom = dom||document.body;//满足iframe中的弹窗要求
                var height = rootDom.scrollHeight;
                var width = rootDom.scrollWidth;
                var totalDom = this.createBackDom(rootDom);
                // var totalDom = $("<div style='position:fixed;left:0px;top:0px;width: 100%;height: 100%;opacity: 0.5;background: black'></div>");
                var alertDom = $("<div class='alert' data-title='' style='line-height:50px;background:white;width: 240px;height: 100px;margin: 0 auto;position: relative '></div>");
                myi18n.changeLan({
                    lan:lan,
                    name:options.name||'',
                    callback:function () {
                        $(alertDom).html($.i18n.prop(title));
                        // totalDom.appendTo("body");
                        $(totalDom).after(alertDom);
                        var timer = setTimeout(function () {
                            clearTimeout(timer);
                            $(totalDom).remove();
                            $(alertDom).remove();
                        },time);
                    }
                });

            },
            createBackDom:function (dom) {
                if($(dom).find('div.background_doom').length == 0){
                    var totalDom = $("<div class='background_doom' style='position:fixed;left:0px;top:0px;width: 100%;height: 100%;opacity: 0.5;background: black;z-index: 2000'></div>");
                    $(totalDom).appendTo($(dom));
                    return totalDom;
                }else{
                    return $(dom).find('div.background_doom')[0];
                }
            },

            layer:function (options) {
                //用于iframe中的弹出窗或者确认窗
                //具体类型根据type来定，目前支持type 有alert ，弹出窗，确认窗口，和视图窗口
                //layer和
                var options = options||{};
                var type  = options.type||"layer";
                var callback = options.callback;
                var title = options.title;
                var name = options.name;
                var lan = options.lan;
                var rootDom = parent.document.body;
                if(type == "alert"){
                    this.alert(options,options.time,options.lan,rootDom);
                    return;
                }


                /*当type为confirm时，options应包含如下几个字段
                options = {
                     type:"confirm",
                     title:title  为国际化文件中对应的属性名,取其值作为询问内容
                     name:国际化文件名
                     lan:国际化选择的语言
                     callback:callback 方法，用户自己处理点击之后的事物逻辑，返回0 --拒绝 ，1 --同意

                }*/
                if(type == "confirm"||type == "search"){
                    //创建底层节点
                    var totalDom = this.createBackDom(rootDom);
                    var confirmNode;
                    //创建 显示的询问弹窗节点
                    if(type == "search"){
                        confirmNode=$("<div class='' data-title='' style='line-height:50px;background:white;width: 300px;min-height: 100px;margin: 0 auto;position: fixed;left: 40%;top:300px;z-index: 9999 '></div>")
                    }else{
                        confirmNode=$("<div class='' data-title='' style='line-height:50px;background:white;width: 300px;min-height: 150px;margin: 0 auto;position: fixed;left: 40%;top:300px;z-index: 9999 '></div>")
                    }
                    $(totalDom).after($(confirmNode));
                    var confirmTitleNode,confirmBodyNode;
                    //创建顶部标题节点
                    if(type == "search"){

                        confirmTitleNode= $("<div class='confirm-title' style='background: #ccc;height: 28px;line-height: 28px;padding-left: 5px'>"+title+"</div>");
                    }else{
                        confirmTitleNode= $("<div class='confirm-title' style='background: #ccc;height: 28px'></div>");
                    }
                    confirmTitleNode.appendTo(confirmNode);
                    if(type=="search"){
                        confirmBodyNode = $("<input id='confirm-body' class='confirm-body' type='text' style='width: 100%;height: 50px;min-height: 50px;word-wrap: break-word;text-align: left;padding: 10px;padding-border: 1px solid #ccc;"+
                            "border: 5px solid #ccc;'>");
                    }else{
                        confirmBodyNode = $("<div class='confirm-body' style='    width: 100%;min-height: 80px;word-wrap: break-word;text-align: left;padding: 10px;padding-border: 1px solid #ccc;"+
                            "border-bottom: 1px solid #ccc;'></div>");
                    }
                    //创建信息展示区域
                    // var confirmBodyNode = $("<div class='confirm-body' style='    width: 100%;min-height: 80px;word-wrap: break-word;text-align: left;padding: 10px;padding-border: 1px solid #ccc;"+
                    //     "border-bottom: 1px solid #ccc;'></div>");
                    //给信息区域添加字段
                    if(type!== "search"){
                        myi18n.changeLan({
                            lan:lan,
                            name:name||'',
                            callback:function () {
                                $(confirmBodyNode).html($.i18n.prop(title));
                            }
                        });
                    }
                    confirmTitleNode.after(confirmBodyNode);
                    //创建底部按钮区域
                    var confirmBtn = $("<div class='confirm-btn-total' style='    height: 40px; text-align: right;line-height: 40px;'>" +
                        "<span class='btn confirm-btn' value='1' style=' background: #ccc;margin-right: 5px;'>确定</span><span class='btn confirm-btn ' value='0'  style='background: #ccc;margin-right: 5px;' >返回</span></div>");
                    $(confirmBodyNode).after(confirmBtn);

                    //监听点击按钮点击事件
                    $(rootDom).one("click",".confirm-btn",function () {
                        var value = $(this).attr("value");
                        if(type == "search"){
                            value = $(confirmBodyNode).val();
                        }
                        //清除弹出层
                        $(totalDom).remove();
                        $(confirmNode).remove();
                        callback(value);
                    })

                }else if(type=="layer"){
                    this.createNewWindow(options);
                }

            },
            createNewWindow:function (options) {
                /*处理参数
                        新窗口采用iframe格式,
                        dom:弹窗依赖的窗口，默认为当前页面的父窗口
                        url:请求新窗口路径url，
                        title:新窗口名称，
                        closeCallback:function,点击关闭按钮后的回调事件;
                        style:{};窗口的样式,可调整弹窗窗口的大小及样式

                */
                var rootDom = options&&options.dom||parent.document.body;
                var url = options&&options.url||'';
                var title = options&&options.title||'';
                var closefn = options&&options.closeCallback||'';
                //设置默认样式
                var slefStyle={
                    "line-height":"50px",
                    "background":"white",
                    "width": "600px",
                    "min-height": "600px",
                    "margin": "0 auto",
                    "position": "fixed",
                    "left": "35%",
                    "top":"200px",
                    "z-index": "9999"
                };
                //根据样式改变样式
                for(var param in options.style){
                    slefStyle[param] = options[param];
                }

                //创建背景节点
                var backZoom =  this.createBackDom(rootDom);

                //创建新窗口的根节点
                var rootZoom = $("<div class='' data-title=''></div>");
                rootZoom.css(slefStyle);
                $(backZoom).after($(rootZoom));

                //创建弹出窗口的子节点:包含一个标题栏和一个iframe主节点
                var titleNode = $("<div><span  style='    padding: 10px; font-size: large;' class='i18n' data-title=''>"+title+"</span><span class='close_btn'></span></div>");
                //关闭按钮创建
                $("<style>.close_btn::before,.close_btn::after{content: '';position: absolute; height: 2px;width: 100%;top: 50%;left: 0px;margin-top: -1px; background: rgb(0, 0, 0);}" +
                    ".close_btn::before{transform:rotate(45deg)} .close_btn::after{transform:rotate(-45deg)}" +
                    ".close_btn{ position: relative; display: inline-block; width: 14px;height: 14px; overflow: hidden;line-height: 16px;float: right; top: 14px;right: 10px;}" +
                    "</style>").appendTo(parent.document.head);
                titleNode.appendTo(rootZoom);
                var iframeNode = $("<iframe style='width: 100%;min-height: 560px;border:1px solid #ccc' src='"+url+"'></iframe>");
                $(titleNode).after(iframeNode);
                $(rootZoom).on("click",'.close_btn',function (e) {
                    $(backZoom).remove();
                    $(rootZoom).remove();
                    if(typeof closefn == "function"){
                        closefn(e);
                    }
                })

            },
            loading:function () {
                var topDom = window.top.document.body;
                var backDom = this.createBackDom(topDom);
                var imgNode = $("<img src='/static/images/loading1.gif' style=''>");
                $(imgNode).css({
                    "line-height":"50px",
                    // "background":"white",
                    "width": "100px",
                    "margin": "0 auto",
                    "position": "fixed",
                    "left": "45%",
                    "top":"350px",
                    "z-index": "9999",
                    'opacity': '0.3'
                });
                $(backDom).after(imgNode);
                this.showDom.push(backDom);
                this.showDom.push(imgNode);
            },
            removeLoading:function () {
                this.showDom.forEach(function (dom,i) {
                    $(dom).remove();
                })
            }
        };


        return  layer;

    });