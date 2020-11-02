import mongoose from 'mongoose'
import colors from '../helpers/colors'

const connect = async () => {
  await mongoose.connect(process.env.DB_CONNECTION, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log(colors.blue('-'.repeat(30)))
  console.log(colors.info('MongoDB has been started'))
}

export default {
  connect,
}
