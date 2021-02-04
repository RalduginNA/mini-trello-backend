import cors from '@koa/cors'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import config from './config'
import db from './db'
import colors from './helpers/colors'
import errorHandler from './middlewares/errorHandler'
import setupRoutes from './setupRoutes'

const app = new Koa()
const rootRouter = setupRoutes()

app.use(helmet())
app.use(errorHandler)
app.use(bodyParser())
app.use(cors())
app.use(rootRouter.routes())
app.use(rootRouter.allowedMethods())

async function bootstrap() {
  try {
    const { PORT, NODE_ENV } = config.app
    await db.connect()
    app.listen(PORT, () => {
      console.log(colors.info(`Server has been started on port: ${PORT}`))
      console.log(colors.info(`Environment: ${NODE_ENV}`))
    })
  } catch (err) {
    console.log(colors.error('Error: Server has been stopped'))
    console.log(err)
  }
}

bootstrap()
