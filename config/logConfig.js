const log4js =  require('log4js') 

const isProduction = process.env.NODE_ENV === 'production'

log4js.configure({
	appenders: {
	  log_date: {  type: 'file', filename: __dirname + 'logs/dateFile', "alwaysIncludePattern": true, "pattern": "-yyyy-MM-dd.log", "encoding" : "utf-8"},
	  log_development: {type: 'console'}
	},
	categories: {
	  default: { appenders: ['log_development'], level: 'debug' },
	  development: { appenders: ['log_development'], level: 'debug' },
	  production: { appenders: ['log_development', 'log_date'], level: 'debug' },
	}
  })

const logger = isProduction ? log4js.getLogger('production') : log4js.getLogger('development')
logger.debug('当前运行环境为:', process.env.NODE_ENV)

module.exports = logger