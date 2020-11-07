import BoardModel from '../../models/Board'
import document from './document'

const isExistBoard = async (boardId) => {
  return await document.isExistDocument(BoardModel, boardId)
}

export default {
  isExist: { validator: isExistBoard, message: `Board doesn't exist` },
}
