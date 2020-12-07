import { Schema, model, Types, Document } from 'mongoose'
import { BOARD_PERMISSION_LEVEL } from '../constants/general'
import { generalOptionsPlugin } from '../helpers/schemaPlugin'
import { Timestamp } from '../types'

export interface Board {
  name: string
  users: Array<Types.ObjectId>
  settings: {
    backgroundImage: string
    permissionLevel: BOARD_PERMISSION_LEVEL
  }
}

interface BoardDoc extends Board, Timestamp, Document {}

const schema = new Schema({
  name: { type: String, required: true },
  users: { type: [{ type: Types.ObjectId, ref: 'User' }], required: true },
  settings: {
    backgroundImage: { type: String, required: true, default: '' },
    permissionLevel: {
      type: String,
      enum: [BOARD_PERMISSION_LEVEL.PRIVATE, BOARD_PERMISSION_LEVEL.GROUP],
      required: true,
      default: BOARD_PERMISSION_LEVEL.PRIVATE,
    },
  },
})

schema.virtual('lists', {
  ref: 'List',
  localField: '_id',
  foreignField: 'boardId',
  justOne: false,
})

schema.virtual('cards', {
  ref: 'Card',
  localField: '_id',
  foreignField: 'boardId',
  justOne: false,
})

schema.plugin(generalOptionsPlugin)

export default model<BoardDoc>('Board', schema)
