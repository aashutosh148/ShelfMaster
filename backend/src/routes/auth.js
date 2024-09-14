import express from 'express';
import { User, validateUser, validateLogin } from '../models/User.js';
import { getSuccessResponse, getErrorResponse } from '../utils/response.js';
import jwt from 'jsonwebtoken'

const router = express.Router();


router.post('/login', async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  const user = await User.findOne({
    email: req.body.email
  });

  if (!user) {
    return res.status(404).json(getErrorResponse("no user found with given email"));
  }

  const isMatch = (user.password === req.body.password);
  if (!isMatch) return res.status(404).json(getErrorResponse("Invalid password"));

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );


  const userObject = user.toObject();
  const { password, __v, ...sanitizedUser } = userObject;


  res.status(200).json(getSuccessResponse(
    "Logged in successfully",
    {
      user: sanitizedUser,
      token: token
    }
  ));

});

router.post('/signup', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(409).json(getErrorResponse("User already exists"));

  user = new User(req.body);

  await user.save();
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  const userObject = user.toObject();
  const { password, __v, ...sanitizedUser } = userObject;
    res.status(200).json(getSuccessResponse(
    "Logged in successfully",
    {
      user: sanitizedUser,
      token: token
    }
  ));
});





export default router;
