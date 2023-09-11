const express = require("express");
const {
  getAllAuthors,
  createAuthor,
} = require("../controllers/authorsController");
const router = express.Router();

// get all authors
router.get("/", getAllAuthors);
router.post("/", createAuthor);

module.exports = router;
