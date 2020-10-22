const argon2 = require('argon2')

const get = async (password) => await argon2.hash(password)
const verify = async (hash, password) => await argon2.verify(hash, password)

module.exports = {
  get,
  verify,
}
