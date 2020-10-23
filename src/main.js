import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import db from './db'
import colors from './helpers/colors'
import rootRouter from './routes'
import 'dotenv/config'

const app = new Koa()

app.use(bodyParser())
app.use(cors())
app.use(rootRouter.routes())
app.use(rootRouter.allowedMethods())

async function bootstrap() {
  const { PORT } = process.env
  await db.connect()
  app.listen(PORT, () => {
    console.log(colors.info(`Server has been started on port: ${PORT}`))
  })
}

bootstrap()
