/**
 * Created by liupengyan on 17/3/23.
 */



require.config({
    baseUrl : GV.STATIC_ROOT + "javascripts",
    shim:{
        "lib/weui":{
            deps: ['lib/jquery']
        }
    }
});

// Start the main app logic.
requirejs(
    [ 'lib/jquery',"lib/weui" ],
    function($,WEUI) {

        $("#alert").on("click",function(){

            $.tips.alert("alert");
        });


        $("#confirm").on("click",function(){

            $.tips.confirm("confirm", function (rs) {
                console.log(rs)
            });
        });

        //toast测试
        $("#toast").on("click",function(){
            $.tips.toast("toast");
        });
        //加载中test
        $("#Loading").on("click",function(){
            var loading= $.tips.loading();

            setTimeout(function(){
                loading.close();
            },2000)
        });

        //弹出提示窗
        $("#doFailPop").on("click",function(){
            var pop= $.tips.submitpop("失败了");

            setTimeout(function(){
                pop.close();
            },2000)
        });

        //弹出提示窗
        $("#doFailPop2").on("click",function(){
            var pop= $.tips.submitpop("成功了","等待通知");

            setTimeout(function(){
                pop.close();
            },2000)
        });

        //勾选按钮
        $("#J_radio_choose").on('click',function(){
            var type = $("#J_radio_choose").attr("data-type");
            $.tips.radiochoose($(this),type);
        });

        //屏幕底部弹窗test
        $("#bottomSelect").on("click",function(){
            var _this=$(this);
            var data=[{key:'yes',value:"是"},{key:'no',value:"否"}];

            WEUI.bottomPop.showBottomPop(data,function(key){

                alert(key);
            });
        });

        $(".star-container").on("click",function(){
            WEUI.star.click($(this))
        });
        //测试评分
        WEUI.star.initStar($('#J_starTest'),5,5,3.4,function(score){

            console.log(score);
        });

        //nav
        $(".top-nav-4 li").on("click",function(){
            WEUI.nav.choose($(this));
        });

        //测试日历
        $("#J_openCalendar").on("click",function(){
            $(this).mydate({format:"yyyy,MM,dd"},function(str){
               console.log(str)
            });
        });

        $(".bot-nav-3 li").on("click",function(){
            WEUI.nav.choose($(this));
        });

        //busy
        $(".myloading").on("click",function(){
            var busy = WEUI.busy.loading($(this));
            setTimeout(function(){
                busy.close();
            },2000)
        });

        $("#switch_btn").on('change',function(){


                if($('#switch_btn_input').is(':checked')) {
                    alert(111);

                }else{
                    alert(22);
            }
        })
    });