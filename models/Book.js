const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    isAvailable: {
      type: Boolean,
      default: true, // Set to true by default (book is in the library)
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who borrowed the book
    },
    category: {
      type: String,
      default: "All",
    },
    // subtitle?
    // pages?
    // date of publication?
    // first edition date of publication?
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
