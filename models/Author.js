const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    createdAt: { type: Date, default: Date.now() },
    firstName: {
      type: String,
      required: [true, "An author must have a first name"],
    },
    lastName: {
      type: String,
      required: [true, "An author must have a last name"],
    },
    category: {
      type: String,
      default: "Any",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
