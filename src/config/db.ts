const {
  DB_NAME = 'mini-trello',
  DB_CONNECTION = 'mongodb+srv://nazar:1234@mini-trello.fgjka.mongodb.net/mini-trello?retryWrites=true&w=majority',
} = process.env

export default {
  DB_CONNECTION,
  DB_NAME,
}
