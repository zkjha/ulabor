var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var session = req.session;
    session.api_session_id = '';
    session.userInfo = "";
    var fullUrl=req.originalUrl;
    var findStr="/admin/sign-in-web/?url=";
    var index= fullUrl.indexOf(findStr);

    var url="";
    if(index!=-1){
        url=fullUrl.slice(index+findStr.length);
    }

    //用户跳转到登陆页面前的url
    //var url=fullUrl;
    if(!url){
        url="";
    }
    res.render('superLogin',
        {
            title:	'用户登录',
            url:url

        }
    );
});

module.exports = router;
