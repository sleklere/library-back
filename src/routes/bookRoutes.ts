import { Router } from "express";
import { protect } from "../controllers/authController.js";
import {
  getAllBooks,
  createBook,
  editBook,
  getBook,
  deleteBook,
  getAllBooksSortAuthor,
  deleteBooks,
} from "../controllers/booksController.js";

const router = Router();

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
router.patch("/:id/edit", editBook);

router.delete("/delete", deleteBooks);
router.delete("/:id", deleteBook);

export default router;
