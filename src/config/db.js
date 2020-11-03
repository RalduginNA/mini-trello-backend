const {
  DB_NAME = 'mini-trello',
  DB_CONNECTION = `mongodb+srv://nazar:1234@mini-trello.fgjka.mongodb.net/mini-trello?retryWrites=true&w=majority`,
  CONNECT_OPTIONS = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
} = process.env

export default {
  DB_CONNECTION,
  DB_NAME,
  CONNECT_OPTIONS,
}
