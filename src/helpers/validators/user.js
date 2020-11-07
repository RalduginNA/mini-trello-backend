import UserModel from '../../models/User'
import document from './document'

const isExistUser = async (userId) => {
  return await document.isExistDocument(UserModel, userId)
}

export default {
  isExist: { validator: isExistUser, message: `User doesn't exist` },
}
