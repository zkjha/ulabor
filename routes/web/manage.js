/**
 * Created by Administrator on 2017/8/2 0002.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

    res.render('manage/index',
        {
            title:	'U-Labor管理后台'

        }
    );
});

module.exports = router;
