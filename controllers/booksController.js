const Book = require("../models/Book");
const { getAll, createOne } = require("./factoryHandlers");

exports.getAllBooks = getAll(Book);
exports.createBook = createOne(Book);
