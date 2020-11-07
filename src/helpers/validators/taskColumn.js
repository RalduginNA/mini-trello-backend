import TaskColumnModel from '../../models/TaskColumn'
import document from './document'

const isExistTaskColumn = async (taskColumnId) => {
  return await document.isExistDocument(TaskColumnModel, taskColumnId)
}

export default {
  isExist: {
    validator: isExistTaskColumn,
    message: `TaskColumn doesn't exist`,
  },
}
