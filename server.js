import mongoose from "mongoose";
import dotenv from "dotenv";

process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION!\nShutting down the server... ");
  console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

dotenv.config();

import app from "./app.js";

const database = process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose
  .connect(database)
  .then(() => console.log("Database connection successful"));

const port = process.env.PORT;

const server = app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION!\nShutting down the server... ");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
