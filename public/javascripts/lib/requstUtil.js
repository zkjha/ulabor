require.config({
    baseUrl : GV.STATIC_ROOT + "javascripts",

});

// Start the main app logic.
define(
    [ 'lib/jquery'],
    function($) {
    	var requstUtil={


    		request:function(object){
    			var url=object.url;
    			var data=object.data;
    			var callback=object.callback;
				    $.ajax({
				    	url:url,
						method:"post",
						dataType:"json",
						data:data,
						success:function(result){
				    		callback(result);
				        },
						error:function(xhr,errorText,errorType){
								
							$.tips.toast("网络请求错误");
                            loading.close();
						}
				    });
    		},
    	};
    	
    	
    	return requstUtil;
    	
});