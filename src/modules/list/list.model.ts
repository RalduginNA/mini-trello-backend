import { Schema, model, Types, Document } from 'mongoose'
import { STATUS_CODES } from '../../constants/api'
import { verifyDocumentId } from '../../utils/document'
import { generalOptionsPlugin } from '../../utils/schemaPlugin'
import { Timestamp } from '../../types'
import HttpError from '../../utils/HttpError'
import BoardModel from '../board/board.model'
import { List } from './list.interfaces'

interface ListDoc extends List, Timestamp, Document {}

const schema = new Schema({
  name: { type: String, required: true },
  position: { type: Number, required: true },
  boardId: { type: Types.ObjectId, required: true, ref: 'Board' },
})

schema.post('validate', async (doc: ListDoc) => {
  try {
    await verifyDocumentId(BoardModel, doc.boardId)
  } catch (err) {
    throw new HttpError(STATUS_CODES.BAD_REQUEST, err.message)
  }
})

schema.virtual('cards', {
  ref: 'Card',
  localField: '_id',
  foreignField: 'listId',
  justOne: false,
})

schema.plugin(generalOptionsPlugin)

export default model<ListDoc>('List', schema)
