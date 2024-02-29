import mongoose from "mongoose";
import dotenv from "dotenv";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!\nShutting down the server... ");
  console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

dotenv.config();

import app from "./app.js";
import { NextFunction, Request, RequestHandler, Response } from "express";

const database = process.env.DB!.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD!,
);

mongoose
  .connect(database)
  .then(() => console.log("Database connection successful"));

const port = process.env.PORT;

console.log(port);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION!\nShutting down the server... ");
  console.log(err.name, err.message);
  console.log(err.stack);
  server.close(() => {
    process.exit(1);
  });
});
