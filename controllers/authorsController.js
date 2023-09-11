const Author = require("../models/Author");
const { getAll, createOne } = require("./factoryHandlers");

exports.getAllAuthors = getAll(Author);
exports.createAuthor = createOne(Author);
