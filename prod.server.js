var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port;
// 之前只在dev环境里面定义了port，没有在上线的build环境下定义Port，所以在config。index下面的build下面定义port为9000

// 启动express
var app = express();
// 定义路由
var router = express.Router();

router.get('/',function (req, res, next) {
    req.url = '/index.html';
    next();
})

app.use(router);

// 异步请求接口
// 去获取data数据，前台请求的，相当于服务器硬盘读取
var appData = require('./data.json')
var seller = appData.seller
var goods = appData.goods
var ratings = appData.ratings

var apiRoutes = express.Router()

apiRoutes.get('/seller', function(req, res) {
  res.json({
    errno:0,   //错误码，表示成功
    data: seller
  })
})

apiRoutes.get('/goods', function(req, res) {
  res.json({
    errno: 0,
    data: goods
  })
})

apiRoutes.get('/ratings', function(req, res) {
  res.json({
    errno: 0,
    data: ratings
  })
})

// 使用接口
app.use('/api', apiRoutes)

// 定义静态文件
app.use(express.static('./dist'))

// 启动express
module.exports = app.listen(port, function (err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('Listening at http://localhost:' + port + '\n');
})