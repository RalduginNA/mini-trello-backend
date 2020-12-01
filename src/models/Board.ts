import { Schema, model, Types, Document } from 'mongoose'
import { BOARD_PERMISSION_LEVEL } from '../constants/general'
import { generalOptionsPlugin } from '../helpers/schemaPlugin'
import { Timestamp } from '../types'

export interface Board {
  name: string
  users: Array<Types.ObjectId>
  lists: Array<Types.ObjectId>
  settings: {
    backgroundImage: string
    permissionLevel: BOARD_PERMISSION_LEVEL
  }
}

interface BoardDoc extends Board, Timestamp, Document {}

const schema = new Schema({
  name: { type: String, required: true },
  users: { type: [{ type: Types.ObjectId, ref: 'User' }], required: true },
  lists: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'List',
      },
    ],
    required: true,
    default: [],
  },
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

schema.plugin(generalOptionsPlugin)

export default model<BoardDoc>('Board', schema)
