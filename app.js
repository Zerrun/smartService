'use strict';
var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var todos = require('./routes/todos');
var test = require('./routes/test');
var AV = require('leanengine');

var app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 加载云函数定义
require('./cloud');
// 加载云引擎中间件
app.use(AV.express());

// 设置默认超时时间
app.use(timeout('15s'));

// 设置强制使用 https 访问
app.enable('trust proxy');
app.use(AV.Cloud.HttpsRedirect());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 指定静态资源根路径为public， 且默认静态资源访问路径为'/'
app.use(express.static('public'));

app.get('/', function(req, res) {
  // res.render('index', { currentTime: new Date() });
  res.redirect('/todos');
});

app.get('/time', function(req, res) {
  res.send({ currentTime: new Date() });
});

// 返回安卓文件
// app.get('/statements.json', function(req, res) {
//     // res.render('test',{'title':'smartService Test!'});
//     // res.sendfile('./routes/apple-app-site-association');
//     res.sendFile('/.well-known/statements.json');
//     // res.send({"a~ o~":" sendfile 说什么废弃了，要用sendFile，可是用法还不一样。。。"})
// });
// 返回json
app.get('/apple-app-site-association', function(req, res) {
    res.send({
        "applinks": {
        "apps": [],
        "details": [
                    "9BNBMDG3PB.com.alipay.iphoneclientErrun": {
                        "paths":[ "*" ]
                        },
                    "LQ38NAVXP6.com.alipay.wallet.test": {
                        "paths":[ "*" ]
                        }
                    ]
            }
        });
});

// 可以将一类的路由单独保存在一个文件中
app.use('/todos', todos);
app.use('/test', test);

app.use(function(req, res, next) {
  // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

// error handlers
app.use(function(err, req, res, next) { // jshint ignore:line
  var statusCode = err.status || 500;
  if(statusCode === 500) {
    console.error(err.stack || err);
  }
  if(req.timedout) {
    console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // 默认不输出异常详情
  var error = {}
  if (app.get('env') === 'development') {
    // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
    error = err;
  }
  res.render('error', {
    message: err.message,
    error: error
  });
});

module.exports = app;
