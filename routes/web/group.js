/**
 * Created by Administrator on 2017/8/2 0002.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/groupList', function(req, res, next) {
    var userInfo = req.session.userInfo
    console.log("11");
    res.render('group/groupList',
        {
            title:	'U-Labor管理后台',
            userInfo:userInfo

        }
    );
});

//详细成员页面
router.get('/detail',function (req,res,next) {
    var session = req.session;
    var userInfo = session.userInfo;
    console.log(userInfo);
    res.render('group/detail',{
        title:	'U-Labor管理后台'
    });
})
//入库管理
router.get('/storageList', function(req, res, next) {
    console.log("11");
    res.render('resourse/storageList',
        {
            title:	'U-Labor管理后台'

        }
    );
});
//新增
router.get('/addGroup',function (req,res,next) {
    console.log("11");
    res.render('group/addGroup',{
        title:'U-Labor管理后台'
    });
});
router.get('/storage', function(req, res, next) {
    // console.log(req.query);
    res.render('resourse/addStorage',
        {
            title:	'U-Labor管理后台'

        }
    );
});

//共享设置界面
router.get('/shareSetting', function(req, res, next) {
    // console.log(req.query);
    res.render('resourse/shareSetting',
        {
            title:	'U-Labor管理后台'

        }
    );
});


module.exports = router;
