const combineRouters = (routers) => {
  const combinedRouters = routers.flatMap((router) => [
    router.routes(),
    router.allowedMethods(),
  ])
  return combinedRouters
}

export default combineRouters
