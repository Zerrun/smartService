'use strict';
var router = require('express').Router();

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象

router.get('/', function(req, res, next) {
    res.render('test',{'title':'smartService Test!'});
});

module.exports = router;
