const isExistDocument = async (model, id) => {
  const document = await model.findById(id)
  return !!document
}

export default {
  isExistDocument,
}
