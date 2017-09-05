/**
 * Created by Administrator on 2017/8/2 0002.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/resourseList', function(req, res, next) {
    var reqObject = req.query;
    var strType='';
    for (var name in reqObject){
        strType = name;
    }
    var userInfo = req.session.userInfo
    console.log("11");
    res.render('resourse/resourseList',
        {
            title:	'U-Labor管理后台',
            strUserType:userInfo.strUserType,
            strType:strType
        }
    );
});

//资源共享管理
router.get('/shareManage',function (req,res,next) {
    var session = req.session;
    var userInfo = session.userInfo;
    console.log(userInfo);
    res.render('resourse/resourseShareList',{
        strUserType:userInfo.strUserType,
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
router.get('/addResourse',function (req,res,next) {
    console.log("11");
    res.render('resourse/addResourse',{
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

//资源详情页面
router.get('/resourseDetail', function(req, res, next) {
    // console.log(req.query);
    res.render('resourse/resourseDetail',
        {
            title:	'U-Labor管理后台'

        }
    );
});

//入库列表
router.get('/storageList', function(req, res, next) {
    // console.log(req.query);
    res.render('resourse/storageList',
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
