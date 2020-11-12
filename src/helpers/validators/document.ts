import { Model } from 'mongoose'

export const verifyDocumentId = async (
  model: Model<any>,
  id: any,
  errMsg?: string,
) => {
  const document = await model.findById(id)
  if (!document) {
    throw new Error(
      errMsg ||
        `Document from ${model.collection.collectionName} collection doesn't exist`,
    )
  }
}

export const verifyDocumentIds = async (
  arr: Array<[model: Model<any>, id: any, errMsg?: string]>,
) => {
  Promise.all(
    arr.map(([model, id, errMsg]) => verifyDocumentId(model, id, errMsg)),
  )
}

export default {
  verifyDocumentId,
  verifyDocumentIds,
}