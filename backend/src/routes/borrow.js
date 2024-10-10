import express from 'express';
import { Borrow, validateBorrow } from '../models/Borrow.js';
  import verifyToken from '../middleware/verifyToken.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.js';
import { Books } from '../models/Book.js';
import { User } from '../models/User.js';

const router = express.Router();

// borrow a book
router.post('/borrow/:id', verifyToken, async (req, res) => {
  const book = await Books.findById(req.params.id);
  if (!book) {
    return sendErrorResponse(res, "Book not found");
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    return sendErrorResponse(res, "User not found");
  }
  if (book.availableCopies < 1) {
    return sendErrorResponse(res, "Book not available, May reserve");
  }
  const { error, value } = validateBorrow({
    user: req.user.id,
    book: req.params.id,
    dueDate: req.body.dueDate ? req.body.dueDate : new Date(new Date().setDate(new Date().getDate() + 14))
  });
  if (error) {
    return sendErrorResponse(res, error.details[0].message);
  }

  const borrow = new Borrow(value);

  const savedBorrow = await borrow.save();

  book.availableCopies -= 1;

  book.borrowedBy.push({
    userId: req.user.id,
    borrowedDate: savedBorrow.borrowDate,
    dueDate: savedBorrow.dueDate
  });
  await book.save();

  user.borrowedBooks.push({
    bookId: savedBorrow.book,
    borrowDate: savedBorrow.borrowDate,
    dueDate: savedBorrow.dueDate
  });
  await user.save();

  return sendSuccessResponse(res, "Book borrowed successfully", savedBorrow);

});

// return a book
router.post('/return/:id', verifyToken, async (req, res) => {
  const book = await Books.findById(borrow.params.id);
  if (!book) {
    return sendErrorResponse(res, "Book not found");
  }

  const borrow = await Borrow.findById(req.body.id);
  if (!borrow) {
    return sendErrorResponse(res, "Borrow not found");
  }

  const user = await User.findById(borrow.user);
  if (!user) {
    return sendErrorResponse(res, "User not found");
  }

  book.availableCopies += 1;
  book.borrowedBy = book.borrowedBy.filter(b => b.userId.toString() !== req.user.id);
  await book.save();

  user.borrowedBooks = user.borrowedBooks.filter(b => b.bookId.toString() !== borrow.book.toString());
  await user.save();

  await borrow.remove();

  return sendSuccessResponse(res, "Book returned successfully");
});

export default router;
