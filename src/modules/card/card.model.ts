import { Schema, model, Document, Types } from 'mongoose'
import { Card } from './card.interfaces'
import BoardModel from '../board/board.model'
import ListModel from '../list/list.model'
import UserModel from '../user/user.model'
import { STATUS_CODES } from '../../constants/api'
import { verifyDocumentIds } from '../../utils/document'
import HttpError from '../../utils/HttpError'
import { generalOptionsPlugin } from '../../utils/schemaPlugin'
import { Timestamp } from '../../types'

interface CardDoc extends Card, Timestamp, Document {}

const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  userId: { type: Types.ObjectId, required: true, ref: 'User' },
  boardId: { type: Types.ObjectId, required: true, ref: 'Board' },
  position: { type: Number, required: true },
  listId: {
    type: Types.ObjectId,
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
