const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  user.password = undefined;

  console.log(user);

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  const correct = await user?.correctPassword(password, user?.password);

  if (!user || !correct)
    return next(new AppError("Incorrect email or password", 401));

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  // because of httpOnly, the cookie can't be deleted, so instead it is overwritten with a new empty one, with a short expiration
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  const authHeaders = req.headers.authorization;
  let token;

  if (authHeaders && authHeaders.startsWith("Bearer")) {
    token = authHeaders.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
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
