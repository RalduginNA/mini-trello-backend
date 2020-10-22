const Koa = require('koa')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const db = require('./db')
const colors = require('./helpers/colors')
const rootRouter = require('./routes')
require('dotenv/config')

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
