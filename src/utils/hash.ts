import argon2 from 'argon2'

const get = async (password: string) => await argon2.hash(password)
const verify = async (hash: string, password: string) =>
  await argon2.verify(hash, password)

export default {
  get,
  verify,
}
