const express = require("express");
const {
  getAllAuthors,
  createAuthor,
} = require("../controllers/authorsController");
const { protect } = require("../controllers/authController");
const router = express.Router();

// get all authors
router.get("/", getAllAuthors);

// protected routes
router.use(protect);

router.post("/", createAuthor);

module.exports = router;
