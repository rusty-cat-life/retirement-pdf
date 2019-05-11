const log4js = import('log4js')

log4js.configure({
  appenders : {
    system : {type : 'file', filename : 'system.log'}
  },
  categories : {
    default : {appenders : ['system'], level : 'debug'},
  }
})

const logger = log4js.getLogger('system')
logger.level = 'error'

module.exports = logger