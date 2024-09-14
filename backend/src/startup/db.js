import { connect } from 'mongoose';
import logger from '../utils/logger.js';
const connectDB = async () => {
  try {
    await connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    logger.info('Connected to MongoDB database.');
  } catch (error) {
    logger.info('Error connecting to MongoDB database:', error);
  }
};

export default connectDB;
