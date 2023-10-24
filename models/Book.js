import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
      index: true,
    },
    isAvailable: {
      type: Boolean,
      default: true, // Set to true by default (book is in the library)
    },
    borrower: {
      type: String,
    },
    categories: {
      type: [String],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Book must belong to a user"],
      index: true, // Index on userId for faster queries
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

bookSchema.pre(/^find/, function (next) {
  // this.populate({ path: "author", select: "id name category" });
  this.populate("author");
  next();
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
