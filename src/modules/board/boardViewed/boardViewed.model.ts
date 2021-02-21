import { Document, model, Schema, Types } from 'mongoose'
import { generalOptionsPlugin } from '../../../utils/schemaPlugin'
import { Timestamp } from '../../../types'
import { BoardViewed } from './boardViewed.interfaces'

interface BoardViewDoc extends BoardViewed, Timestamp, Document {}

const schema = new Schema({
  userId: { type: Types.ObjectId, required: true, ref: 'User' },
  boardId: { type: Types.ObjectId, required: true, ref: 'Board' },
})

schema.pre<BoardViewDoc>('save', async function () {
  await this.model('BoardViewed').deleteMany({
    userId: this.userId,
    boardId: this.boardId,
  })
})

schema.plugin(generalOptionsPlugin)

export default model<BoardViewDoc>('BoardViewed', schema, 'board_viewed')
