import { taskRepository } from '../repositories/task.repository';
import { Task } from '../entity/task.entity';

export class TaskService {
    async createTask(name: string, startDate?: string, endDate?: string): Promise<Task> {
        const task = new Task();
        task.name = name;
        task.startDate = startDate;
        task.endDate = endDate;

        return await taskRepository.save(task);
    }

    async getTasks(): Promise<Task[]> {
        return await taskRepository.find();
    }

    async getTaskById(id: number): Promise<Task | null> {
        return await taskRepository.findOneBy({ id });
    }

    async updateTask(id: number, name: string, startDate?: string, endDate?: string): Promise<Task | null> {
        const task = await this.getTaskById(id);
        if (!task) {
            return null;
        }

        task.name = name;
        task.startDate = startDate;
        task.endDate = endDate;

        return await taskRepository.save(task);
    }

    async deleteTask(id: number): Promise<boolean> {
        const result = await taskRepository.delete({ id });
        return result.affected !== 0;
    }
}
