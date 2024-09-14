import jwt from 'jsonwebtoken';
import { getErrorResponse } from '../utils/response.js';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1];


  if (!token) {
    return res.status(400).json(getErrorResponse("Token not found"));
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);
  req.user = verified;
  next();
};

export default verifyToken;
