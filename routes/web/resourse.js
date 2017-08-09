/**
 * Created by Administrator on 2017/8/2 0002.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/resourseList', function(req, res, next) {
    console.log("11");
    res.render('resourse/resourseList',
        {
            title:	'U-Labor管理后台'

        }
    );
});
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


module.exports = router;
