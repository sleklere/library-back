import Author from "../models/Author.js";
import APIFeatures from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const addAuthorToBody = async reqBody => {
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

export const createOne = Model => async (req, res, next) => {
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

export const getAll = Model => async (req, res) => {
  try {
    // To allow for nested GET reviews on tour (hack)
    let filter = { userId: req.user._id };
    if (req.params.author) filter.author = req.params.author;
    // Execute Query
    const features = new APIFeatures(Model.find(filter), req.query)
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
  } catch (err) {
    next(err);
  }
};

export const getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
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

export const updateOne = Model =>
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

export const deleteOne = Model =>
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
export const deleteMany = Model =>
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
