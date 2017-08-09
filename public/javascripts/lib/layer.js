require.config({
    baseUrl : GV.STATIC_ROOT + "javascripts",

});
define(
    [ 'lib/jquery','lib/myi18n'],
    function($,myi18n) {
        var layer={

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
                if(type == "confirm"){
                    //创建底层节点
                    var totalDom = this.createBackDom(rootDom);
                    //创建 显示的询问弹窗节点
                    var confirmNode =$("<div class='' data-title='' style='line-height:50px;background:white;width: 300px;min-height: 150px;margin: 0 auto;position: fixed;left: 40%;top:300px;z-index: 9999 '></div>")
                    $(totalDom).after($(confirmNode));
                    //创建顶部标题节点
                    var confirmTitleNode = $("<div class='confirm-title' style='background: #ccc;height: 28px'></div>");
                    confirmTitleNode.appendTo(confirmNode);
                    //创建信息展示区域
                    var confirmBodyNode = $("<div class='confirm-body' style='    width: 100%;min-height: 80px;word-wrap: break-word;text-align: left;padding: 10px;padding-border: 1px solid #ccc;"+
                        "border-bottom: 1px solid #ccc;'></div>");
                    //给信息区域添加字段
                    myi18n.changeLan({
                        lan:lan,
                        name:name||'',
                        callback:function () {
                            $(confirmBodyNode).html($.i18n.prop(title));
                        }
                    });
                    confirmTitleNode.after(confirmBodyNode);
                    //创建底部按钮区域
                    var confirmBtn = $("<div class='confirm-btn-total' style='    height: 40px; text-align: right;line-height: 40px;'>" +
                        "<span class='btn confirm-btn' value='1' style=' background: #ccc;margin-right: 5px;'>同意</span><span class='btn confirm-btn ' value='0'  style='background: #ccc;margin-right: 5px;' >拒绝</span></div>");
                    $(confirmBodyNode).after(confirmBtn);

                    //监听点击按钮点击事件
                    $(rootDom).on("click",".confirm-btn",function () {
                        var value = $(this).attr("value");
                        //清除弹出层
                        $(totalDom).remove();
                        $(confirmNode).remove();
                        callback(value);
                    })

                }

            }
        };


        return layer;

    });