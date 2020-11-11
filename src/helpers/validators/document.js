export const verifyDocumentId = async (model, id, errMsg) => {
  const document = await model.findById(id)
  if (!document) {
    throw new Error(
      errMsg ||
        `Document from ${model.collection.collectionName} collection doesn't exist`,
    )
  }
}

export const verifyDocumentIds = async (arr) => {
  return Promise.all(
    arr.map(([model, id, errMsg]) => verifyDocumentId(model, id, errMsg)),
  )
}

export default {
  verifyDocumentId,
  verifyDocumentIds,
}
