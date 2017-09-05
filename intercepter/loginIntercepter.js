/**
 * Created by liupengyan on 16/12/12.
 * 用户登陆拦截
 */
var loginIntercepter=function(req, res, next) {
    var x_requested_with=req.get("x-requested-with");
    if(x_requested_with){//ajax请求
        console.log("ajax请求拦截");
        if (req.session.api_session_id) {  // 判断用户是否登录
            next();
        }else{
            var json_body={"code":-1,"msg":"未登陆"};
            res.send(json_body);
        }

    }else{//网页请求
        console.log("网页请求拦截");
            if (req.session.api_session_id) {  // 判断用户是否登录
                next();
            } else {
                // res.redirect("/admin/sign-in-web/?url="+req.originalUrl);
                res.redirect("/admin/notLogin");
          }
    }

};

module.exports = loginIntercepter;