import { NextFunction, Request, Response } from "express";
import AppError, { IAppError } from "../utils/appError.js";
import { CastError, Error } from "mongoose";

export const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

interface DuplicateError extends Error {
  // keyValue?: { [key: string]: any };
  keyValue: [key: string];
}

const handleDuplicateFieldsDB = (err: DuplicateError) => {
  let message;
  // send custom error message back to the client
  if ("email" in err.keyValue) {
    message = "A user with that email already exists";
  } else {
    message = `Duplicate field value: ${Object.entries(err.keyValue)
      .join(" ")
      .replaceAll(",", ": ")}. Please use another value!`;
  }
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: { errors: Array<Error> }) => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: IAppError, req: Request, res: Response) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProd = (err: IAppError, req: Request, res: Response) => {
  // Operational error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Other errors
  console.error("ERROR 💥", err);

  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

export default (
  err: IAppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    // not a good practice to overwrite the args of a function, therefore a copy is created
    let error = Object.assign(err);

    // Invalid id
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    sendErrorProd(error, req, res);
  }
};
