import mongoose from "mongoose";
import { Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "A category must have a name"],
      unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
