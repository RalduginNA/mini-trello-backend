import Router from '@koa/router'

const combineRouters = (routers: Array<Router>) => {
  const combinedRouters = routers.flatMap((router) => [
    router.routes(),
    router.allowedMethods(),
  ])
  return combinedRouters
}

export default combineRouters
