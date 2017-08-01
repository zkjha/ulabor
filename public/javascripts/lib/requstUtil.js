require.config({
    baseUrl : GV.STATIC_ROOT + "javascripts",
    shim:{
        "lib/weui":{
            deps: ['lib/jquery']
        }
    }
});

// Start the main app logic.
define(
    [ 'lib/jquery',"lib/weui"],
    function($,WEUI) {
    	var requstUtil={
    			
    		btnRequire:function(object){
                var loading= $.tips.loading();
    			var url=object.url;
    			var data=object.data;
    			var _this_btn=object._this_btn;
    			
    			var callback=object.callback;

               if(_this_btn.hasClass("btn-full")){
                   var is_busy_ing=_this_btn.hasClass("btn-full-disable");
                   if(is_busy_ing){
                       return;
                   }
                   _this_btn.addClass("btn-full-disable");
               }else if(_this_btn.hasClass("btn-empty")){
                   var is_busy_ing=_this_btn.hasClass("btn-empty-disable");
                   if(is_busy_ing){
                       return;
                   }
                   _this_btn.addClass("btn-empty-disable");
               }


				    $.ajax({
				    	url:url,
							method:"post",
							dataType:"json",
							data:data,
				              success:function(result){
                                  loading.close();

                                  if(result.status==404){
                                      $.tips.toast("node请求路径错误");
                                      return ;
                                  }

								var result_code = result.code;
								
								
								 if(result_code==-1){

									$.tips.toast("未登录",function(){
										var search=window.location.search;
									var path=window.location.pathname+search;
									window.location.href="/user/sign-in-web?url="+path;
								});
								}else if(result_code==-2){
                                     _this_btn.removeClass("busy_ing")
									//$.tips.toast("必填字段未填写");
									 $.tips.toast(result.msg);
								}else if(result_code==-3){
                                     _this_btn.removeClass("busy_ing")
									$.tips.toast("参数类型错误");
								}else if(result_code==-4){
                                     _this_btn.removeClass("busy_ing")
									$.tips.toast("未知错误");
								}else if(result_code==-5){
                                     _this_btn.removeClass("busy_ing")
									//$.tips.toast("系统错误");
									 $.tips.toast(result.msg);
								}else if(result_code==-6){
                                     _this_btn.removeClass("busy_ing")
									$.tips.toast("token错误");
								}else if(result_code==-7){
                                     _this_btn.removeClass("busy_ing")
									$.tips.toast("参数超长");
								}else if(result_code==-8){
                                     _this_btn.removeClass("busy_ing")
									//$.tips.toast("没有数据");
									
								}else{
									if(callback&&typeof callback==='function'){
										callback(result);
					  				}
									
								}
                              if(_this_btn.hasClass("btn-full")){

                                  _this_btn.removeClass("btn-full-disable");
                              }else if(_this_btn.hasClass("btn-empty")){

                                  _this_btn.removeClass("btn-empty-disable");
                              }

				        },
							error:function(xhr,errorText,errorType){
                                loading.close();
                                if(_this_btn.hasClass("btn-full")){

                                    _this_btn.removeClass("btn-full-disable");
                                }else if(_this_btn.hasClass("btn-empty")){

                                    _this_btn.removeClass("btn-empty-disable");
                                }
								$.tips.toast("网络请求错误");
								
							}
				    });
    			
    		},
    		request:function(object){
                var loading= $.tips.loading();
    			var url=object.url;
    			var data=object.data;
    			var callback=object.callback;
    			
				    $.ajax({
				    	url:url,
							method:"post",
							dataType:"json",
							data:data,
				              success:function(result){
                                  if(result.status==404){
                                      $.tips.toast("node请求路径错误");
                                      return ;
                                  }

								var result_code = result.code;
								
								 if(result_code==-1){
									$.tips.toast("未登录",function(){
										var search=window.location.search;
									var path=window.location.pathname+search;
									window.location.href="/user/sign-in-web?url="+path;
								});
								}else if(result_code==-2){
									//$.tips.toast("必填字段未填写");
									 $.tips.toast(result.msg);
								}else if(result_code==-3){
									$.tips.toast("参数类型错误");
								}else if(result_code==-4){
									$.tips.toast("未知错误");
								}else if(result_code==-5){
									 //$.tips.toast("系统错误");
									 $.tips.toast(result.msg);
								}else if(result_code==-6){
									$.tips.toast("token错误");
								}else if(result_code==-7){
									$.tips.toast("参数超长");
								}else if(result_code==-8){
									//$.tips.toast("没有数据");
									 callback(result);
								}else{
									if(callback&&typeof callback==='function'){
										callback(result);
					  				}
									
								}
                                  loading.close();
				        },
							error:function(xhr,errorText,errorType){
								
								$.tips.toast("网络请求错误");
                                loading.close();
							}
				    });
    			
    		},
			no_loding_request:function(object){

				var url=object.url;
				var data=object.data;
				var callback=object.callback;

				$.ajax({
					url:url,
					method:"post",
					dataType:"json",
					data:data,
					success:function(result){
						if(result.status==404){
							$.tips.toast("node请求路径错误");
							return ;
						}

						var result_code = result.code;

						if(result_code==-1){
							$.tips.toast("未登录",function(){
								var search=window.location.search;
								var path=window.location.pathname+search;
								window.location.href="/user/sign-in-web?url="+path;
							});
						}else if(result_code==-2){
							//$.tips.toast("必填字段未填写");
							$.tips.toast(result.msg);
						}else if(result_code==-3){
							$.tips.toast("参数类型错误");
						}else if(result_code==-4){
							$.tips.toast("未知错误");
						}else if(result_code==-5){
							//$.tips.toast("系统错误");
							$.tips.toast(result.msg);
						}else if(result_code==-6){
							$.tips.toast("token错误");
						}else if(result_code==-7){
							$.tips.toast("参数超长");
						}else if(result_code==-8){
							//$.tips.toast("没有数据");
							callback(result);
						}else{
							if(callback&&typeof callback==='function'){
								callback(result);
							}

						}

					},
					error:function(xhr,errorText,errorType){

						$.tips.toast("网络请求错误");

					}
				});

			}
    		
    		
    	};
    	
    	
    	return requstUtil;
    	
    	
});