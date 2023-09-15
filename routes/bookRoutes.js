const express = require("express");
const {
  getAllBooks,
  createBook,
  editBook,
} = require("../controllers/booksController");
const { protect } = require("../controllers/authController");
const router = express.Router();

// get all books
router.get("/", getAllBooks);
// get one book

// protected routes
router.use(protect);

// add a new book to the library
router.post("/", createBook);
// modify a book's information
router.post("/:id/edit", editBook);

module.exports = router;
