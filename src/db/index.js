import mongoose from 'mongoose'
import colors from '../helpers/colors'
import config from '../config'

const connect = async () => {
  const { DB_CONNECTION, CONNECT_OPTIONS } = config.db
  await mongoose.connect(DB_CONNECTION, CONNECT_OPTIONS)
  console.log(colors.blue('-'.repeat(30)))
  console.log(colors.info('MongoDB has been started'))
}

export default {
  connect,
}
