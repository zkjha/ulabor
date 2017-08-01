(function( window , document ){ 
	'use strict';
	function MobileHotCss() {
		 
		 this.width = 750;//设置默认最大宽度
	     this.fontSize = 100;//默认字体大小
	     this.widthProportion = function(){
	       var p = (document.body&&document.body.clientWidth || document.getElementsByTagName("html")[0].offsetWidth)/this.width;
	       
	         return p>1?1:p<0.4?0.4:p;
	     };
	     this.changePage = function(){
	      
	         document.getElementsByTagName("html")[0].setAttribute("style","font-size:"+this.widthProportion()*this.fontSize+"px !important");
             document.getElementsByTagName("html")[0].setAttribute("data-size",this.widthProportion()*this.fontSize)
	     }
	 }
	var _this_mobilehotcss=new MobileHotCss();
	_this_mobilehotcss.changePage();
    window.addEventListener("resize",function(){_this_mobilehotcss.changePage();},false);
})( window , document );