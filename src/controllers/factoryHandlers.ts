import { FilterQuery, Model, Query } from "mongoose";
import Author, { IAuthor } from "../models/Author.js";
import APIFeatures from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { IUser } from "../models/User.js";
import { IBook } from "../models/Book.js";
import { NextFunction, Request, Response } from "express";

export const addAuthorToBody = async (reqBody: { author: string }) => {
  const { author } = reqBody;

  let authorDoc = await Author.findOne({ name: author });

  if (!authorDoc) {
    authorDoc = await Author.create({ name: author });
  }

  reqBody.author = authorDoc.id;

  return reqBody;
};

// export const createOne = Model =>
//   catchAsync(async (req, res) => {
//     // if its a book, check if the author exists in the db
//     let reqBody = req.body;
//     if (req.body.author) {
//       reqBody = await addAuthorToBody(reqBody);
//     }
//     const doc = await Model.create(reqBody);

//     if (!doc) {
//       console.log("NO DOCUMENT WAS CREATED");
//       throw new AppError("Document could not be created", 400);
//     }

//     const modelName = Model.modelName.toLowerCase();

//     res.status(201).json({
//       status: "success",
//       data: {
//         [modelName]: doc,
//       },
//     });
//   });

/*
 WORKS ONLY FOR TESTING
*/

export const createOne =
  <T>(Model: Model<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // if its a book, check if the author exists in the db
      let reqBody = req.body;
      if (req.body.author) {
        reqBody = await addAuthorToBody(reqBody);
      }
      const doc = await Model.create(reqBody);

      if (!doc) {
        throw new AppError("Document could not be created", 400);
      }

      const modelName = Model.modelName.toLowerCase();

      res.status(201).json({
        status: "success",
        data: {
          [modelName]: doc,
        },
      });
    } catch (err) {
      next(err);
    }
  };

export const getAll = <T>(Model: Model<T>) =>
  catchAsync(async (req, res) => {
    // To allow for nested GET reviews on tour (hack)
    let filter: FilterQuery<T> = {
      userId: req.user!._id,
    };
    if (req.params.author) {
      filter = { ...filter, author: req.params.author } as FilterQuery<T>;
    }

    // Execute Query
    const features = new APIFeatures<IBook | IUser | IAuthor>(
      Model.find(filter),
      req.query,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    const modelName = Model.modelName.toLowerCase();

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        [`${modelName}s`]: doc,
      },
    });
  });

interface Populate {
  author?: string;
  user?: string;
}

export const getOne = <T>(
  Model: Model<T>,
  populateOptions: Populate | undefined,
) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id) as Query<T[], T, Model<T>>;
    if (populateOptions) {
      // If populateOptions is provided, use populate for each key in the options
      for (const key in populateOptions) {
        query = query.populate(key);
      }
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    const modelName = Model.modelName.toLowerCase();

    res.status(200).json({
      status: "success",
      data: {
        [modelName]: doc,
      },
    });
  });

export const updateOne = <T>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    let reqBody;
    if (Model.modelName === "Book") {
      reqBody = await addAuthorToBody(req.body);
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, reqBody, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    const modelName = Model.modelName.toLowerCase();

    res.status(200).json({
      status: "success",
      data: {
        [modelName]: doc,
      },
    });
  });

export const deleteOne = <T>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    // 204 -> No content
    res.status(204).json({
      status: "success",
      // data is sent as null to show that deleted resource no longer exists
      data: null,
    });
  });
export const deleteMany = <T>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    const { bookIDs } = req.body;
    const deletions = await Model.deleteMany({ _id: { $in: bookIDs } });

    console.log(deletions);

    if (!deletions) {
      return next(new AppError("No documents were deleted", 500));
    }

    // 204 -> No content
    res.status(204).json({
      status: "success",
      // data is sent as null to show that deleted resource no longer exists
      data: deletions,
    });
  });
