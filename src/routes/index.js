const Router = require('@koa/router')
const secureRouter = require('./secure')

const rootRouter = new Router({ prefix: '/api' })

rootRouter.use(secureRouter.routes(), secureRouter.allowedMethods())

module.exports = rootRouter
