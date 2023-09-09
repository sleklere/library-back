const express = require("express");

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/globalErrorHandler");

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

app.use(xss());

app.use(hpp());

// route handling

// fallback for undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
