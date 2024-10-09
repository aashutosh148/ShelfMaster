import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import logger from './src/utils/logger.js';
import connectDB from './src/startup/db.js';
import loggerConfig from './src/middleware/loggerConfig.js';
import corsPrefs from './src/middleware/corsPrefs.js';
import routes from './src/startup/routes.js';
import swaggerUi from 'swagger-ui-express';
import specs from './src/startup/swagger.js';

dotenv.config();
connectDB();

const app = express();


app.use(corsPrefs);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(loggerConfig);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

routes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
})

