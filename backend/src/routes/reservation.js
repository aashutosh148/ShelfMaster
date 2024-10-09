import express from 'express';
import { validateReserve, Reserve } from '../models/Reserve.js';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// reserve a book
router.post('/reserve/:id', verifyToken, async (req, res) => {
  const { error, value } = validateReserve({
    user: req.user.id,
    book: req.params.id
  });
  if (error) {
    return sendErrorResponse(res, error.details[0].message);
  }

  const reserve = new Reserve(value);

  await reserve.save();

  return sendSuccessResponse(res, "Book reserved successfully", reserve);
});

// cancel a reservation
router.post('/cancel/:id', verifyToken, async (req, res) => {
  const reserve = await Reserve.findById(req.params.id);
  if (!reserve) {
    return sendErrorResponse(res, "Reservation not found");
  }

  if (reserve.user.toString() !== req.user.id) {
    return sendErrorResponse(res, "Unauthorized");
  }

  if (reserve.status === 'cancelled') {
    return sendErrorResponse(res, "Reservation already cancelled");
  }

  reserve.status = 'cancelled';
  await reserve.save();

  return sendSuccessResponse(res, "Reservation cancelled successfully", reserve);
});


// get all reservations of a user
router.get('/reservations/:userId', verifyToken, (req, res) => {
  if (req.user.role !== 'admin' && req.params.userId !== req.user.id) {
    return sendErrorResponse(res, "You aren't authorized, Admin privilege needed");
  }
  Reserve.find({ user: req.params.userId })
    .populate('book')
    .exec((err, reservations) => {
      if (err) {
        return sendErrorResponse(res, err.message);
      }

      return sendSuccessResponse(res, "Reservations fetched successfully", reservations);
    });
});


export default router;
