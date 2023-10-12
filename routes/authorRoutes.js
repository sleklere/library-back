import {
  getAllAuthors,
  createAuthor,
  editAuthor,
} from "../controllers/authorsController";
import { protect } from "../controllers/authController";
import { Router } from "express";

const router = Router();

// get all authors
router.get("/", getAllAuthors);

// protected routes
router.use(protect);

router.post("/", createAuthor);
router.post("/:id/edit", editAuthor);

export default router;
