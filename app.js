var express = require('express');
var helmet = require('helmet');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var bodyParserXml=require("body-parser-xml")(bodyParser);
var multipart = require('connect-multiparty');
/**
 * 引入自定义router
 * @type {router|exports}
 */
var loginIntercepter = require('./intercepter/loginIntercepter');

var login = require('./routes/web/login');
var manage=require('./routes/web/manage');
var ajax_login = require('./routes/ajax/login');


//资源管理
var resourse = require('./routes/web/resourse');
var ajaxResourse = require('./routes/ajax/resourse');


var app = express();
app.use(helmet());
// 设置  view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// 设置 favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.xml({
    limit: "1MB",   // Reject payload bigger than 1 MB
    xmlParseOptions: {
        normalize: true,     // Trim whitespace inside text nodes
        normalizeTags: true, // Transform tags to lowercase
        explicitArray: false // Only put nodes in array if >1
    },
    verify: function(req, res, buf, encoding) {
        if(buf && buf.length) {
            // Store the raw XML
            req.rawBody = buf.toString(encoding || "utf8");
        }
    }
}));

app.use(bodyParser.json());
app.use(multipart());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use("/static",express.static(path.join(__dirname, 'public')));

// 设置 Session
app.use("/",session({
    store: new RedisStore({
        //host:"linux.fushoukeji.com",
        host:"203.195.163.251",
        port: 6379,
        db:1,
        //pass:"Fushoukeji123"
        pass:"963woonnys888"
    }),
    secret: '12345',
    name: 'weixin_session_id',
    cookie: {maxAge: 2591000000},
    resave: true,
    saveUninitialized: true,
    rolling:true
}));
//用户登陆拦截
app.use("/admin/manage/*",loginIntercepter);

//http://www.open-open.com/lib/view/open1421307039328.html
//app.use('/system', system);

app.use('/admin/sign-in-web', login);
app.use('/admin/ajax-sign-in-web', ajax_login);

app.use('/admin/manage',manage);


app.use('/admin/manage/resourse',resourse);
app.use('/admin/manage/ajaxResourse',ajaxResourse);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    //next(err);
    res.render('error/404',
        {	title:	'404',
            error: err
        }
    );
});



// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error/500', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error/500', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
