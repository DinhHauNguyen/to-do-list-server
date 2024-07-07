import request from 'supertest';
import app from '../src/app';
import { taskRepository } from '../src/repositories/task.repository';

beforeEach(async () => {
    await taskRepository.clear();
});

describe('Task API Endpoints', () => {
    it('should create a new task', async () => {
        const newTask = {
            name: 'Test Task',
            startDate: '2024-07-07',
            endDate: '2024-07-10'
        };

        const res = await request(app)
            .post('/tasks')
            .send(newTask)
            .expect(201);

        expect(res.body.name).toEqual(newTask.name);
        expect(res.body.startDate).toEqual(newTask.startDate);
        expect(res.body.endDate).toEqual(newTask.endDate);
    });

    it('should handle validation errors when creating a task', async () => {
        const invalidTask = {
            name: '',
            startDate: '2024-07-07',
            endDate: '2024-07-10'
        };

        const res = await request(app)
            .post('/tasks')
            .send(invalidTask)
            .expect(400);

        expect(res.body.message).toEqual('Task name must be non-empty and not exceed 80 characters');
    });

    it('should handle validation errors when creating a task', async () => {
        const invalidTask = {
            name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            startDate: '2024-07-07',
            endDate: '2024-07-10'
        };

        const res = await request(app)
            .post('/tasks')
            .send(invalidTask)
            .expect(400);

        expect(res.body.message).toEqual('Task name must be non-empty and not exceed 80 characters');
    });

    it('should handle missing start date when end date is provided', async () => {
        const taskWithEndDateNoStartDate = {
            name: 'Task with End Date Only',
            endDate: '2024-07-10'
        };

        const res = await request(app)
            .post('/tasks')
            .send(taskWithEndDateNoStartDate)
            .expect(400);

        expect(res.body.message).toEqual('Start date must be present if end date is provided');
    });

    it('should get all tasks', async () => {
        // First, create some tasks to retrieve
        await request(app)
            .post('/tasks')
            .send({ name: 'Task 1' });

        await request(app)
            .post('/tasks')
            .send({ name: 'Task 2' });

        const res = await request(app)
            .get('/tasks')
            .expect(200);

        expect(res.body.length).toBe(2);
    });

    it('should get a task by ID', async () => {
        // Create a task first
        const createRes = await request(app)
            .post('/tasks')
            .send({ name: 'Task to find' });

        const taskId = createRes.body.id;

        const getRes = await request(app)
            .get(`/tasks/${taskId}`)
            .expect(200);

        expect(getRes.body.name).toEqual('Task to find');
    });

    it('should update a task', async () => {
        // Create a task first
        const createRes = await request(app)
            .post('/tasks')
            .send({ name: 'Task to update' });

        const taskId = createRes.body.id;

        const updateData = {
            name: 'Updated Task Name',
            startDate: '2024-07-08'
        };

        const updateRes = await request(app)
            .put(`/tasks/${taskId}`)
            .send(updateData)
            .expect(200);

        expect(updateRes.body.name).toEqual('Updated Task Name');
        expect(updateRes.body.startDate).toEqual('2024-07-08');
    });

    it('should delete a task', async () => {
        // Create a task first
        const createRes = await request(app)
            .post('/tasks')
            .send({ name: 'Task to delete' });

        const taskId = createRes.body.id;

        await request(app)
            .delete(`/tasks/${taskId}`)
            .expect(204);

        // Verify the task is deleted
        const getRes = await request(app)
            .get(`/tasks/${taskId}`)
            .expect(404);
    });

    it('should handle not found when updating a non-existent task', async () => {
        const updateData = {
            name: 'Updated Task Name'
        };

        const updateRes = await request(app)
            .put('/tasks/999')
            .send(updateData)
            .expect(404);

        expect(updateRes.body.message).toEqual('Task not found');
    });

    it('should handle not found when deleting a non-existent task', async () => {
        const deleteRes = await request(app)
            .delete('/tasks/999')
            .expect(404);

        expect(deleteRes.body.message).toEqual('Task not found');
    });

    it('should handle errors from middleware', async () => {
        jest.spyOn(taskRepository, 'save').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const newTask = {
            name: 'Test Task',
            startDate: '2024-07-07',
            endDate: '2024-07-10'
        };

        const res = await request(app)
            .post('/tasks')
            .send(newTask)
            .expect(500)
            .catch();
    });
});

describe('Task Validation Middleware', () => {
    it('should return 400 if start date format is invalid', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({ name: 'Valid Task', startDate: '07-01-2024' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Start date must be formatted as YYYY-MM-DD');
    });

    it('should return 400 if end date format is invalid', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({ name: 'Valid Task', startDate: '2024-07-01', endDate: '07-02-2024' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('End date must be formatted as YYYY-MM-DD');
    });
});