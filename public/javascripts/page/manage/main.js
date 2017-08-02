/**
 * Created by liupengyan on 2014/8/18.
 */

require.config({
	
    baseUrl:GV.STATIC_ROOT+"javascripts",
    shim: {  
	  'lib/bootstrap': {
	     deps: ['lib/jquery']
	    }
	}
});

// Start the main app logic.
requirejs(['lib/jquery','lib/bootstrap'],function($,bootstrap){
	changeiframesize();
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
	
});	
