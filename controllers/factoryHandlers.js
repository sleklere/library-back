const Author = require("../models/Author");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createOne = Model =>
  catchAsync(async (req, res) => {
    // if its a book, check if the author exists in the db
    let reqBody = req.body;
    if (req.body.author) {
      let author = await Author.findOne({ name: req.body.author });

      if (!author) {
        author = await Author.create({ name: req.body.author });
      }
      reqBody.author = author._id;
    }
    const doc = await Model.create(reqBody);

    const modelName = Model.modelName.toLowerCase();

    res.status(201).json({
      status: "success",
      data: {
        [modelName]: doc,
      },
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res) => {
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
  });

exports.getOne = (Model, populateOptions) =>
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

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
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

exports.deleteOne = Model =>
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
