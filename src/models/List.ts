import { Schema, model, Types, Document } from 'mongoose'
import BoardModel from './Board'
import HttpError from './HttpError'
import { STATUS_CODES } from '../constants/api'
import { verifyDocumentId } from '../helpers/validators/document'
import { generalOptionsPlugin } from '../helpers/schemaPlugin'
import { Timestamp } from '../types'

export interface List {
  name: string
  boardId: Types.ObjectId
  position: number
}

interface ListDoc extends List, Timestamp, Document {}

const schema = new Schema({
  name: { type: String, required: true },
  position: { type: Number, required: true, unique: true },
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
