var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('notLogin',
        {
            title:	'用户未登录',
        }
    );
});

module.exports = router;
