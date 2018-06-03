const Koa = require('koa')
const Cookies = require('cookies')
const fs = require('fs')
const url = require('url')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const views = require('koa-views')
const logger = require('./config/logConfig')
const controller = require('./controller.js')

const app = new Koa()
const isProduction = process.env.NODE_ENV === 'production'

//加载静态资源文件
app.use(static(path.join(__dirname, '/dist/')))

//解析url
app.use(bodyParser())

app.use(views(__dirname + '/dist/assets', {
	extension: 'ejs'
}))

app.use(controller())

app.listen(3000)
logger.info(`[ECblog开始运行]`)