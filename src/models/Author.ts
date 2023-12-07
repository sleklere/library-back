import mongoose from "mongoose";

export interface IAuthor extends Document {
  createdAt: Date;
  name: string;
  categories: Array<string>;
}

const authorSchema = new mongoose.Schema<IAuthor>(
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

const Author = mongoose.model<IAuthor>("Author", authorSchema);

export default Author;
