const Author = require("../models/Author");
const { getAll, createOne, updateOne } = require("./factoryHandlers");

exports.getAllAuthors = getAll(Author);
exports.createAuthor = createOne(Author);
exports.editAuthor = updateOne(Author);
