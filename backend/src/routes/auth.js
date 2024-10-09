import express from 'express';
import { User, validateUser, validateLogin } from '../models/User.js';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return sendErrorResponse(res, error.details[0].message);
  }

  const user = await User.findOne({
    email: req.body.email
  });

  if (!user) {
    return sendErrorResponse(res, "User not found");
  }

  const isMatch = (user.password === req.body.password);
  if (!isMatch) sendErrorResponse(res, "Invalid credentials");

  const token = jwt.sign({
    id: user._id,
    role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const userObject = user.toObject();
  const { password, __v, ...sanitizedUser } = userObject;

  return sendSuccessResponse(res, "Logged in successfully", {
    user: sanitizedUser,
    token: token
  });
});


router.post('/signup', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) sendErrorResponse(res, error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) sendErrorResponse(res, "User already exists");

  user = new User(req.body);

  await user.save();
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  const userObject = user.toObject();
  const { password, __v, ...sanitizedUser } = userObject;
  return sendSuccessResponse(res, "User added successfully", {
    user: sanitizedUser,
    token: token
  });
});





export default router;



