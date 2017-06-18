var router = require('express').Router();
// 引用 wechat 库，详细请查看 https://github.com/node-webot/wechat
var wechat = require('wechat');
var config = {
  token: '请把微信后台要求输入的 token 填写在这里',
  appid: '请把微信的 AppID 填写在这里',
  encodingAESKey: '请把微信后台为您生成的 EncodingAESKey 填写在这里'
};

var WechatAPI = require('wechat-api');
var api = new WechatAPI('请把微信的 AppID 填写在这里',
  '请把微信的 Secret Key 填写在这里');
