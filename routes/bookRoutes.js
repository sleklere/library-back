const express = require("express");
const { getAllBooks, createBook } = require("../controllers/booksController");
const router = express.Router();

// get all books
router.get("/", getAllBooks);
// get one book
// add a new book to the library
router.post("/", createBook);
// modify a book's information

module.exports = router;
