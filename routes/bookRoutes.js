const express = require("express");
const {
  getAllBooks,
  createBook,
  editBook,
  getBook,
  deleteBook,
  getAllBooksSortAuthor,
} = require("../controllers/booksController");
const { protect } = require("../controllers/authController");
const router = express.Router();

// protected routes
router.use(protect);

router.get("/sortAuthor", getAllBooksSortAuthor);

// get one book
router.get("/:id", getBook);

// get all books
router.get("/", getAllBooks);

// add a new book to the library
router.post("/", createBook);
// modify a book's information
router.post("/:id/edit", editBook);

router.delete("/:id", deleteBook);

module.exports = router;
