import { Schema, model, Document, Types } from 'mongoose'
import { MEMBERSHIP_ROLES } from '../../constants/general'
import { generalOptionsPlugin } from '../../helpers/schemaPlugin'
import { Membership } from './membership.interfaces'

interface MembershipDoc extends Membership, Document {}

const schema = new Schema({
  boardId: { type: Types.ObjectId, required: true, ref: 'Board' },
  userId: { type: Types.ObjectId, required: true, ref: 'User' },
  role: {
    type: String,
    enum: [MEMBERSHIP_ROLES.ADMIN, MEMBERSHIP_ROLES.USER],
    required: true,
  },
})

schema.plugin(generalOptionsPlugin)

export default model<MembershipDoc>('Membership', schema)
