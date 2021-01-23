import { Document, model, Schema, Types } from 'mongoose'
import { generalOptionsPlugin } from '../../helpers/schemaPlugin'
import { Timestamp } from '../../types'
import { BoardView } from './boardView.interfaces'

interface BoardViewDoc extends BoardView, Timestamp, Document {}

const schema = new Schema({
  userId: { type: Types.ObjectId, required: true, ref: 'User' },
  boardId: { type: Types.ObjectId, required: true, ref: 'Board' },
  date: { type: Date, required: true, default: Date.now() },
})

schema.pre<BoardViewDoc>('save', async function () {
  await this.model('BoardView').deleteMany({
    userId: this.userId,
    boardId: this.boardId,
  })
})

schema.plugin(generalOptionsPlugin)

export default model<BoardViewDoc>('BoardView', schema)
