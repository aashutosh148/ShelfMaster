import express from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.js";
import { Fine } from "../models/Fine.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

//GET /fines/:userId: Get all unpaid fines for a specific user.
router.get("/:userId", verifyToken, async (req, res) => {
  if (req.user.role !== "admin" && userId !== req.user.id) {
    return sendErrorResponse(res, 403, "You are not authorized to perform this action.");
  }
  const userId = req.params.userId;

  const fines = await Fine.find({ user: userId, paid: false });
  return sendSuccessResponse(res, 200, fines);

});

//POST /fines/pay/:id: Mark a fine as paid.

router.post("/pay/:id", verifyToken, async (req, res) => {
  try {
    const fineId = req.params.id;
    const fine = await Fine.findByIdAndUpdate(fineId, { paid: true }, { new: true });
    return sendSuccessResponse(res, 200, fine);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
});
