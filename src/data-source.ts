import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Task } from './entity/task.entity';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: false,
    entities: [Task],
    migrations: [],
    subscribers: [],
});
