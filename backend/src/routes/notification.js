import express from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.js";
import { Notification, validateNotification } from "../models/Notification.js";
import verifyToken from "../middleware/verifyToken.js";
import { User } from "../models/User.js";

const router = express.Router();

//get all notifications of user
router.get("/:userId", verifyToken, async (req, res) => {
  if (req.user.role !== "admin" && req.params.userId !== req.user.id) {
    return sendErrorResponse(res, "You aren't authorized, Admin privilege needed");
  }
  const notifications = await Notification.find({ user: req.user.id });
  return sendSuccessResponse(res, "Notifications fetched successfully", notifications);
});

//marked read
router.put("/markRead/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin" && req.body.userId !== req.user.id) {
    return sendErrorResponse(res, "You aren't authorized, Admin privilege needed");
  }

  const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  return sendSuccessResponse(res, "Notification marked as read", notification);
});

//delete a notification
router.get('/delete/:id', verifyToken, async (req, res) => {
  if (req.user.role !== "admin" && req.params.userId !== req.user.id) {
    return sendErrorResponse(res, "You aren't authorized, Admin privilege needed");
  }

  const notification = await Notification.findByIdAndDelete(req.params.id);
  return sendSuccessResponse(res, "Notification deleted successfully", notification);
})

export default router;
