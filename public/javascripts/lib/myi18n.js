require.config({
    baseUrl : GV.STATIC_ROOT + "javascripts",


});

// Start the main app logic.
define(
    [ 'lib/jquery'],
    function($) {
        var i18n={

            /*
            * 由于兼容性ie8问题，现在国际化自己配置解决,不打扰以前写法
            * 再以前的文件下创建相应的js文件，符合requireJs的模块写法
            * 动态加载文件并做相应的动作
            *
            *
            * */

            changeLan:function (options) {
                var name = options.name||"index";//本项目默认文件为index.properties
                var lan = options.lan;
                var callbacks = options.callback;
                var path = "lib/i18n/"+lan+"/"+name;
                requirejs([path],
                    function (lanObject) {
                    callbacks(lanObject);
                })
            },




            //主动处理国际化转换，在callback里面处理事件
            // options={
            //      name:name,
            //      lan:lan,
            //      callback:callback
            // }
            // changeLan:function  (options) {
            //     var name = options.name||"index";//本项目默认文件为index.properties
            //     var lan = options.lan;
            //     var callbacks = options.callback;
            //     jQuery.i18n.properties({
            //         name:name,//资源名
            //         path:'/static/javascripts/lib/i18n/'+lan+'/',//资源所处路径,本项目默认存放地址为lib/i18n
            //         mode:'map',//匹配类型
            //         language:lan,
            //         callback:callbacks
            //     })
            // },
            // 公共处理方法，
            //      将对那些以.i18n的节点的text节点替换，data-title="配置文件中的属性名"；
            //          如<label class="i18n" data-title="myName">哈哈</label>，配置文件里myName=詹姆斯
            //      以.i18n-input 的节点,将获取selectattr属性的值，该属性值的写法为 xxx_attr,其中xxx_attr需在配置文件中
            //      配置相应的值，attr 为替换的属性值，比如input 的placeholder
            //          <input class="i18n-input selectattr="myname_placeholder" > 。
            //      配置文件中myname_placeholder=请输入名字

            //options={
            //      name:name
            //      lan:lan
            // }
            common:function (options) {
                var callback = function (object) {
                    var insertEle = $(".i18n"),errArr=[];
                    for(var i=0,l=insertEle.length;i<l;i++){
                        var item = $(insertEle[i]);
                        var text = object[item.attr('data-title')];
                        if(!text){
                            errArr.push((item.attr('data-title')+" not found"));
                        }else{
                            item.html(text);
                        }

                    }
                    // insertEle.each(function() {
                    //     var item = $(this);
                    //     // 根据i18n元素的 name 获取内容写入
                    //     item.html($.i18n.prop(item.attr('data-title')));
                    // });
                    var insertInputEle = $(".i18n-input");
                    for(var i=0,l=insertInputEle;i<l;i++){
                        var item = $(insertInputEle[i]);
                        var selectAttr = item.attr('selectattr');
                        var attrName = selectAttr.split("_")[1];
                        if (!attrName) {
                            attrName = "value";
                        };
                        var text = object[item.attr('selectattr')];
                        if(!text){
                            errArr.push((item.attr('selectattr')+" not found"))
                        }else{
                            item.attr(attrName, object[item.attr('selectattr')]);
                        }

                    }
                    if(errArr.length !== 0){
                        console.log(errArr);
                    }

                    // insertInputEle.each(function() {
                    //     var item = $(this);
                    //     var selectAttr = item.attr('selectattr');
                    //     var attrName = selectAttr.split("_")[1];
                    //     if (!attrName) {
                    //         attrName = "value";
                    //     };
                    //     item.attr(attrName, $.i18n.prop(item.attr('selectattr')));
                    // });
                }
                options.callback = callback;
                this.changeLan(options);
            }
        }
        return i18n;
    });