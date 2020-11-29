import { Schema, model, Types, Document } from 'mongoose'
import BoardModel from './Board'
import HttpError from './HttpError'
import { STATUS_CODES } from '../constants/api'
import { verifyDocumentId } from '../helpers/validators/document'
import { generalOptionsPlugin } from '../helpers/schemaPlugin'

export interface List {
  name: string
  cards: Array<Types.ObjectId>
  boardId: Types.ObjectId
}

interface ListDoc extends List, Document {}

const schema = new Schema({
  name: { type: String, required: true },
  cards: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Card',
      },
    ],
    required: true,
    default: [],
  },
  boardId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Board',
  },
})

schema.post('validate', async (doc: ListDoc) => {
  try {
    await verifyDocumentId(BoardModel, doc.boardId)
  } catch (err) {
    throw new HttpError(STATUS_CODES.BAD_REQUEST, err.message)
  }
})

schema.plugin(generalOptionsPlugin)

export default model<ListDoc>('List', schema)
