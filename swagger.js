const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Products list",
      version: "1.0.0",
      description: "Test task for fortylines io, made by Baitemir",
    },
    servers: [
      {
        url: "https://test-task-fortylines-backend.onrender.com", 
      },
    ],
  },
  
  apis: ["./controller/*.js"],  
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
