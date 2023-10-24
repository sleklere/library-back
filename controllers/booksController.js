import Book from "../models/Book.js";
import catchAsync from "../utils/catchAsync.js";
import {
  getAll,
  createOne,
  updateOne,
  getOne,
  deleteOne,
  deleteMany,
} from "./factoryHandlers.js";

export const getAllBooks = getAll(Book);
export const getBook = getOne(Book);
export const createBook = createOne(Book);
export const editBook = updateOne(Book);
export const deleteBook = deleteOne(Book);
export const deleteBooks = deleteMany(Book);

export const getAllBooksSortAuthor = catchAsync(async (req, res) => {
  // Determine sorting order based on the 'sort' query parameter
  let sortField = "author.name"; // Default sorting field (ascending)
  let sortOrder = 1;

  if (req.query.sort === "author") {
    sortField = "author.name"; // Sort by author name in ascending order
  } else if (req.query.sort === "-author") {
    sortOrder = -1; // Sort by author name in descending order
  } else {
    sortField = req.query.sort;
    sortOrder = req.query.sort.includes("-") ? "desc" : "asc";
  }

  // Execute Query
  const aggregate = Book.aggregate([
    {
      $lookup: {
        from: "authors", // Name of the referenced collection
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: "$author", // Unwind the array created by $lookup
    },
    {
      $sort: { [sortField]: sortOrder }, // Dynamic sorting based on 'sortField'
    },
  ]);

  const doc = await aggregate;

  const modelName = Book.modelName.toLowerCase();

  res.status(200).json({
    status: "success",
    results: doc.length,
    data: {
      [`${modelName}s`]: doc,
    },
  });
});
