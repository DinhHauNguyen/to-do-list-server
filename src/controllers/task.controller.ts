import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';

const taskService = new TaskService();

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, startDate, endDate } = req.body;
        const task = await taskService.createTask(name, startDate, endDate);
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await taskService.getTasks();
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.getTaskById(parseInt(req.params.id));
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, startDate, endDate } = req.body;
        const task = await taskService.updateTask(parseInt(req.params.id), name, startDate, endDate);
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const success = await taskService.deleteTask(parseInt(req.params.id));
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        next(error);
    }
};
