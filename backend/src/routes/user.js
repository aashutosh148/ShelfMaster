import express from 'express';
import { User, validateUser } from '../models/User.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.js';
import isAdmin from '../middleware/isAdmin.js';
import verifyToken from '../middleware/verifyToken.js';


const router = express.Router();


//get all user
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  const allUsers = await User.find().select('-password -__v');

  if (allUsers.length > 0) {
    return sendSuccessResponse(res,"all user found", allUsers);
  }
  return sendErrorResponse(res, "No user found");
});

// get user by id (both user, Admin)
router.get('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.params.id !== req.user.id) {
    return sendErrorResponse(res, "You aren't authorized, Admin privilege needed");
  }

  const user = await User.findById(req.params.id).select('-password -__v');

  if (!user) {
    return sendErrorResponse(res, "User not found");
  }
  return sendSuccessResponse(res, "User found", user);
});

// add Library staff
router.post('/addStaff', verifyToken, isAdmin, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) sendErrorResponse(res, error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) sendErrorResponse(res, "User already registered");

  user = new User(req.body);
  await user.save();

  const userObject = user.toObject();
  const { password, __v, ...sanitizedUser } = userObject;
  return sendSuccessResponse(res, "Staff Added", sanitizedUser);
});

// update user by id details (both user, Admin)
router.put('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.params.id !== req.user.id) {
    return sendErrorResponse(res, "You aren't authorized, Admin privilege needed");
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password -__v');

  if (!user) {
    return sendErrorResponse(res, "User not found");
  }

  return sendSuccessResponse(res, "User Updated", user);
});

// delete user by id (both user, Admin)
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.params.id !== req.user.id) {
    return sendErrorResponse(res, "You aren't authorized, Admin privilege needed");
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return sendErrorResponse(res, "User not found");
  }
  return sendSuccessResponse(res, "User Deleted", user);

});


export default router;
