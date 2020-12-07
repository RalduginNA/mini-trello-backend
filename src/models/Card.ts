import { Schema, model, Document, Types } from 'mongoose'
import HttpError from './HttpError'
import { STATUS_CODES } from '../constants/api'
import UserModel from './User'
import BoardModel from './Board'
import ListModel from './List'
import { verifyDocumentIds } from '../helpers/document'
import { generalOptionsPlugin } from '../helpers/schemaPlugin'
import { Timestamp } from '../types'

export interface Card {
  title: string
  description?: string
  userId: Types.ObjectId
  boardId: Types.ObjectId
  listId: Types.ObjectId
  position: number
}

interface CardDoc extends Card, Timestamp, Document {}

const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  boardId: { type: Schema.Types.ObjectId, required: true, ref: 'Board' },
  position: { type: Number, required: true },
  listId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'List',
  },
})

schema.post('validate', async (doc: CardDoc) => {
  const { boardId, userId, listId } = doc
  try {
    await verifyDocumentIds([
      [BoardModel, boardId],
      [UserModel, userId],
      [ListModel, listId],
    ])
  } catch (err) {
    throw new HttpError(STATUS_CODES.BAD_REQUEST, err.message)
  }
})

schema.plugin(generalOptionsPlugin)

export default model<CardDoc>('Card', schema)
