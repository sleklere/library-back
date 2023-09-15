const Book = require("../models/Book");
const { getAll, createOne, updateOne } = require("./factoryHandlers");

exports.getAllBooks = getAll(Book);
exports.createBook = createOne(Book);
exports.editBook = updateOne(Book);
