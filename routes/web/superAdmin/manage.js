/**
 * Created by Administrator on 2017/8/2 0002.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var userInfo = req.session.userInfo||{};
    var name = userInfo.strNickName||'朋友';
    console.log(name);
    res.render('superAdmin/manage/main',
        {
            title:	'U-Labor管理后台',
            strname:name,
            strUserType:userInfo.strUserType
        }
    );
});


module.exports = router;
