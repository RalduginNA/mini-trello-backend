import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import db from './db'
import colors from './helpers/colors'
import errorHandler from './middlewares/errorHandler'
import rootRouter from './routes'
import config from './config'

const app = new Koa()

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
