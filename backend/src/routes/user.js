import express from 'express';
import { User, validateUser } from '../models/User.js';
import { getSuccessResponse, getErrorResponse } from '../utils/response.js';
import isAdmin from '../middleware/isAdmin.js';
import verifyToken from '../middleware/verifyToken.js';


const router = express.Router();

router.get('/all', verifyToken, isAdmin, async (req, res) => {
  const allUsers = await User.find().select('-password -__v');

  if (allUsers.length > 0) {
    return res.status(200).json(getSuccessResponse("all user found", allUsers));
  }
  return res.status(409).json(getErrorResponse("No user found"));
});


router.get('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.params.id !== req.user.id) {
    return res.status(403).json(getErrorResponse("You aren't authorized, Admin privilege needed"));
  }

  const user = await User.findById(req.params.id).select('-password -__v');

  if (!user) {
    return res.status(404).json(getErrorResponse("User not found"));
  }
  return res.status(200).json(getSuccessResponse("User found", user));
});


router.post('/addStaff', verifyToken, isAdmin, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(409).json(getErrorResponse("User already exists"));

  user = new User(req.body);
  await user.save();

  const userObject = user.toObject();
  const { password, __v, ...sanitizedUser } = userObject;
  return res.status(200).json(getSuccessResponse('User added with admin privilege', sanitizedUser));
});

router.put('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.params.id !== req.user.id) {
    return res.status(403).json(getErrorResponse("You aren't authorized, Admin privilege needed"));
  }

  const { error } = validateUser(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password -__v');

  if (!user) {
    return res.status(400).json(getErrorResponse("User not found"));
  }

  return res.status(200).send(getSuccessResponse("Details Updated", user));
});

router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.params.id !== req.user.id) {
    return res.status(403).json(getErrorResponse("You aren't authorized, Admin privilege needed"));
  }

  const id = req.user.id;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(400).json(getErrorResponse("User Not Found"));
  }
  return res.status(200).json(getSuccessResponse("User Successfully Deleted"));

});


export default router;
