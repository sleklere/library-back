const Book = require("../models/Book");
const {
  getAll,
  createOne,
  updateOne,
  getOne,
  deleteOne,
} = require("./factoryHandlers");

exports.getAllBooks = getAll(Book);
exports.getBook = getOne(Book);
exports.createBook = createOne(Book);
exports.editBook = updateOne(Book);
exports.deleteBook = deleteOne(Book);
