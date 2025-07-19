import swaggerJSDoc from 'swagger-jsdoc';
import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

/**
 * @description Swagger/OpenAPI specification options
 */
const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'T3 Skeleton API',
      version: '1.0.0',
      description: 'API documentation for the T3 Skeleton backend',
    },
    servers: [
      {
        url: process.env.FRONTEND_URL || 'http://localhost:8080',
        description: 'Frontend (Client)',
      },
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Backend (Local)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['src/routes/**/*.ts', 'src/controllers/**/*.ts', 'src/schemas/**/*.ts', 'src/app.ts'],
};

/**
 * @description Setup Swagger UI docs in development environment
 * @param app Express app instance
 */
export const setupSwaggerDocs = (app: Application): void => {
  if (process.env.NODE_ENV === 'development') {
    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('📚 Swagger UI available at http://localhost:' + process.env.PORT + '/api-docs');
  }
};
