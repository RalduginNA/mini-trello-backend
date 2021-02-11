import mongoose from 'mongoose'
import colors from '../utils/colors'
import config from '../config'

const connect = async () => {
  const { DB_CONNECTION } = config.db
  await mongoose.connect(DB_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  console.log(colors.debug('-'.repeat(30)))
  console.log(colors.info('MongoDB has been started'))
}

export default {
  connect,
}
