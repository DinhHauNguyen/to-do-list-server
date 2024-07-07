import express from 'express';
import { AppDataSource } from './data-source';
import { taskRouter } from './routes/task.route';
import setupSwagger from './setupSwagger';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.SERVER_PORTAL;

const app = express();
app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

app.use('/tasks', taskRouter);
setupSwagger(app);

export default app;
