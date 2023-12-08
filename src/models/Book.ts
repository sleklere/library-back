import mongoose, {
  Document,
  ObjectId,
  PopulatedDoc,
  Schema,
  Types,
} from "mongoose";
import { IAuthor } from "./Author.js";

export interface IBook extends Document {
  createdAt: Date;
  title: string;
  author: ObjectId | IAuthor;
  isAvailable: boolean;
  borrower: string;
  categories: Array<string>;
  userId: ObjectId;
}

const bookSchema = new Schema<IBook>(
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
      type: Schema.ObjectId,
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
      type: Schema.ObjectId,
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

bookSchema.pre<IBook>(/^find/, function (next) {
  // this.populate({ path: "author", select: "id name category" });
  this.populate("author");
  next();
});

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
