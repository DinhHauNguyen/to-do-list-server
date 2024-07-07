import { AppDataSource } from '../data-source';
import { Task } from '../entity/task.entity';

export const taskRepository = AppDataSource.getRepository(Task);
