import { Model, Types, Document } from 'mongoose'

export async function verifyDocumentId<T extends Document>(
  model: Model<T>,
  id: Types.ObjectId | string,
  errMsg?: string,
) {
  const document = await model.findById(id)
  if (!document) {
    throw new Error(
      errMsg ||
        `Document from ${model.collection.collectionName} collection doesn't exist`,
    )
  }
  return document
}

export const verifyDocumentIds = async (
  arr: Array<
    [model: Model<Document>, id: Types.ObjectId | string, errMsg?: string]
  >,
) => {
  Promise.all(
    arr.map(([model, id, errMsg]) => verifyDocumentId(model, id, errMsg)),
  )
}
