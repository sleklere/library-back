import {
  getAllAuthors,
  createAuthor,
  editAuthor,
} from "../controllers/authorsController.js";
import { protect } from "../controllers/authController.js";
import { Router } from "express";

const router = Router();

// get all authors
router.get("/", getAllAuthors);

// protected routes
router.use(protect);

router.post("/", createAuthor);
router.post("/:id/edit", editAuthor);

export default router;
