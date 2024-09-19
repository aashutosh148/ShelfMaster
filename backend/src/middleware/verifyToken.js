import jwt from 'jsonwebtoken';
import { sendErrorResponse } from '../utils/response.js';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendErrorResponse(res, "Access denied, Token required");
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);
  req.user = verified;
  next();
};

export default verifyToken;
