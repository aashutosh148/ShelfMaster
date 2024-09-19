import express from "express";
import { Books, validateBook } from "../models/Book.js";
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// get all books
router.get('/all', verifyToken, async (req, res) => {
  const allBooks = await Books.find();

  if (allBooks.length > 0) {
    return sendSuccessResponse(res, "All Books found", allBooks);
  }
  return sendErrorResponse(res, "No Books found");

});

// get book by id
router.get('/:id', verifyToken, async (req, res) => {
  const book = await Books.findById(req.params.id);

  if (!book) {
    return sendErrorResponse(res, "Book not found");
  }

  return sendSuccessResponse(res, "Book found", book);
});

// add a book
router.post('/addBook', verifyToken, isAdmin, async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).json(getErrorResponse(error.details[0].message));

  let book = await Books.findOne({ title: req.body.title });
  if (book) {
    return sendErrorResponse(res, "Book already exists");
  }

  book = new Books(req.body);
  await book.save();

  return sendSuccessResponse(res, "Book added successfully", book);
});

//update a book by id
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const book = await Books.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!book) {
    return sendErrorResponse(res, "Book not found");
  }

  return sendSuccessResponse(res, "Book updated successfully", book);
});


//remove a book by id
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  const book = await Books.findByIdAndDelete(req.params.id);
  if (!book) {
    return sendErrorResponse(res, "Book not found");
  }
  return sendSuccessResponse(res, "Book deleted successfully", book);
});

export default router;





