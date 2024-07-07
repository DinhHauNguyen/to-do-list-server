import { Router } from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/task.controller';
import { validateTask } from '../validation/taskValidation';

const taskRouter = Router();

taskRouter.post('/', validateTask, createTask);
taskRouter.get('/', getTasks);
taskRouter.get('/:id', getTaskById);
taskRouter.put('/:id', validateTask, updateTask);
taskRouter.delete('/:id', deleteTask);

export { taskRouter };
