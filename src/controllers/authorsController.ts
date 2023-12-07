import Author from "../models/Author.js";
import { getAll, createOne, updateOne } from "./factoryHandlers.js";

export const getAllAuthors = getAll(Author);
export const createAuthor = createOne(Author);
export const editAuthor = updateOne(Author);
