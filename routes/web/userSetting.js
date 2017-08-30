/**
 * Created by Administrator on 2017/8/2 0002.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
//管理员设置
router.get('/Administrator', function(req, res, next) {
    var userInfo = req.session.userInfo
    console.log("11");
    res.render('userSetting/Administrator',
        {
            title:	'U-Labor管理后台',

        }
    );
});

//成员管理
router.get('/menberManage', function(req, res, next) {
    var userInfo = req.session.userInfo
    console.log("11");
    res.render('userSetting/menber',
        {
            title:	'U-Labor管理后台',

        }
    );
});



module.exports = router;
