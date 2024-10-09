import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDefs from './swaggerDefs.json' assert { type: "json" };

const options = {
  definition: swaggerDefs,
  apis: [],
};

const specs = swaggerJsdoc(options);

export default specs;
