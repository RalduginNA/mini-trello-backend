import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import db from './db'
import colors from './helpers/colors'
import errorHandler from './helpers/errorHandler'
import rootRouter from './routes'
import config from './config'
import 'dotenv/config'

const app = new Koa()

app.use(errorHandler)
app.use(bodyParser())
app.use(cors())
app.use(rootRouter.routes())
app.use(rootRouter.allowedMethods())

async function bootstrap() {
  try {
    const { PORT } = config.app
    await db.connect()
    app.listen(PORT, () => {
      console.log(colors.info(`Server has been started on port: ${PORT}`))
    })
  } catch (e) {
    console.log(colors.error('Error: Server has been stopped'))
    console.log(e)
  }
}

bootstrap()
