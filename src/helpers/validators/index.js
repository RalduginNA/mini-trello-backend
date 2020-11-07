import userValidator from './user'
import boardValidator from './board'
import taskValidator from './task'
import taskColumnValidator from './taskColumn'

export default {
  user: userValidator,
  board: boardValidator,
  task: taskValidator,
  taskColumn: taskColumnValidator,
}