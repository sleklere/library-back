import express, { application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean";
import hpp from "hpp";

import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/globalErrorHandler.js";
import booksRouter from "./routes/bookRoutes.js";
import authorRouter from "./routes/authorRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// middleware setup
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    // methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    // credentials: true,
  }),
);

// Security HTTP headers
// Best to set it at the beginning to make sure the headers are always set
app.use(helmet());

// logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());

// app.use(xss());

app.use(hpp());

// route handling
app.use("/api/v1/books", booksRouter);
app.use("/api/v1/authors", authorRouter);
app.use("/api/v1/users", userRouter);

// fallback for undefined routes
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Can't find (${req.method}) ${req.originalUrl} on this server!`,
      404,
    ),
  );
});

app.use(globalErrorHandler);

export default app;
