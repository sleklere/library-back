const express = require("express");
const {
  getAllBooks,
  createBook,
  editBook,
  getBook,
  deleteBook,
} = require("../controllers/booksController");
const { protect } = require("../controllers/authController");
const router = express.Router();

// get all books
router.get("/", getAllBooks);
// get one book
router.get("/:id", getBook);

// protected routes
router.use(protect);

// add a new book to the library
router.post("/", createBook);
// modify a book's information
router.post("/:id/edit", editBook);

router.delete("/:id", deleteBook);

module.exports = router;
