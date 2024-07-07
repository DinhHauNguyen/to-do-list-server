import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import express from 'express'

const setupSwagger = (app: express.Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export default setupSwagger;
