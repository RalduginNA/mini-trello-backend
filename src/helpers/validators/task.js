import TaskModel from '../../models/Task'
import document from './document'

const isExistTask = async (taskId) => {
  return await document.isExistDocument(TaskModel, taskId)
}

export default {
  isExist: { validator: isExistTask, message: `Task doesn't exist` },
}
