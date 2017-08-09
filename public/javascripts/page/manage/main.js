/**
 * Created by liupengyan on 2014/8/18.
 */

require.config({
	
    baseUrl:GV.STATIC_ROOT+"javascripts",
    shim: {
    	'lib/bootstrap': {
    		deps: ['lib/jquery']
		},
	}
});

// Start the main app logic.
requirejs(['lib/jquery','lib/bootstrap','lib/myi18n'],function($,bootstrap,myi18n){



	//页面布局格式
	changeiframesize();

	//设默认语言为选中状态
	if(localStorage.getItem("lan")){
		$("select option[value="+localStorage.getItem('lan')+"]").attr("selected",true);
	}else{
		localStorage.setItem("lan",localStorage.getItem("navigatorLan"));
	}

	//切换语言
    var lan = localStorage.getItem("lan")||$(".changLan select")[0].value||localStorage.getItem("navigatorLan");
	changLan(lan);


	//切换语言事件
	$("#changLan_select").on("change",function (e) {
		localStorage.setItem("lan",e.target.value);
		changLan(e.target.value||lan);
    })

	//点击退出按钮事件
	$("#quit").on("click",function () {
		location.href="/admin/sign-in-web"
    })
	$(window).resize(function(){
	    changeiframesize();
	});
	$(".lpy-sidebar-first a").click(function(){
	$(".lpy-sidebar-second").hide();
	    $(this).parent().next().slideDown();
	});
	$(".lpy-sidebar-first:first a").click();
	$(".lpy-sidebar-second li a").click(function(){
	    var _this=$(this);
	    var url=_this.attr("data-url");
	    $(".active").removeClass("active");
	    _this.parent().addClass("active");
	    $("#J_iframe").attr("src",url);
	});
	$(".lpy-sidebar-second:first li:first a").click();
	function changeiframesize(){
		var window_height=$(window).height();
		$(".main").css("height",window_height-55)
	}
	$(".dhx_set").click(function(){
	    var _this=$(this);
	    var url=$(this).attr("data-url");
	    $("#J_iframe").attr("src",url);
	});


	//处理国际化转换问题
	function changLan (lan) {
		var name = $("#i18n_pagename").attr("content");
		//如果用户选择了语言则用选择语言，否则用浏览器默认语言

		myi18n.common({
			name:name,
			lan:lan
		});
    }
	
});	
