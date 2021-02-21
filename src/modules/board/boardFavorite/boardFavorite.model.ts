import { Document, model, Schema, Types } from 'mongoose'
import { generalOptionsPlugin } from '../../../utils/schemaPlugin'
import { Timestamp } from '../../../types'
import { BoardFavorite } from './boardFavorite.interfaces'

interface BoardStarDoc extends BoardFavorite, Timestamp, Document {}

const schema = new Schema({
  userId: { type: Types.ObjectId, required: true, ref: 'User' },
  boardId: { type: Types.ObjectId, required: true, ref: 'Board' },
})

schema.plugin(generalOptionsPlugin)

export default model<BoardStarDoc>('BoardFavorite', schema, 'board_stared')
