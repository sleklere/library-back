const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    createdAt: { type: Date, default: Date.now() },
    name: {
      type: String,
      required: [true, "An author must have a first name"],
      unique: true,
    },
    // firstName: {
    //   type: String,
    //   required: [true, "An author must have a first name"],
    // },
    // lastName: {
    //   type: String,
    //   required: [true, "An author must have a last name"],
    // },
    categories: {
      type: [String],
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    toObject: { virtuals: true },
  },
);

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
