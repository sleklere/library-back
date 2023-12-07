import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  user.password = undefined;

  // res.status(201).json({
  //   status: "success",
  //   data: {
  //     user,
  //   },
  // });
  createSendToken(user, 200, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("Please provide username and password!", 400));
  }

  const user = await User.findOne({ username }).select("+password");
  const correct = await user?.correctPassword(password, user?.password);

  if (!user || !correct)
    return next(new AppError("Incorrect username or password", 401));

  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  const authHeaders = req.headers.authorization;
  let token;

  if (authHeaders && authHeaders.startsWith("Bearer")) {
    token = authHeaders.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please login to access.", 401),
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  // check if current user still exists
  if (!currentUser) {
    return next("The user belonging to the token does no longer exist.", 401);
  }

  // conceed access
  req.user = currentUser;
  next();
});
