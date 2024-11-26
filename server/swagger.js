const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Writer/Editor Dashboard Site API Documentation',
      version: '1.0.0',
      description: 'Automatically generated API documentation.',
    },
  },
  apis: ['./routes/**/*.js'],
};

const swaggerInfo = swaggerDocument(swaggerOptions);

module.exports = swaggerInfo;
