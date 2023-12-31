import supertest from "supertest";
import { protect, signToken } from "./authController.js";
import app from "../app.js";
import { it, describe, expect, beforeAll, afterAll, vi } from "vitest";
import mongoose from "mongoose";
import AppError from "../utils/appError.js";

const request = supertest(app);

let req = {};
const res = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn(x => x),
};

const next = vi.fn(x => x);

beforeAll(() => {
  const database = process.env.DB.replace(
    "<PASSWORD>",
    process.env.DB_PASSWORD,
  );

  mongoose
    .connect(database)
    .then(() => console.log("Database connection successful"));
});

// afterAll(() => {
//   mongoose.disconnect();
// });

/////////////////////

describe("PROTECT MIDDLEWARE", () => {
  const authToken = signToken("650330e518616d0affa8d0c9");

  it("allow access if a valid token is provided", async () => {
    const res = await request
      .get("/api/v1/books")
      .set("Authorization", `Bearer ${authToken}`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(200);
  });

  it("should call next without arguments (no error) if a valid token is provided", async () => {
    req = { headers: { authorization: `Bearer ${authToken}` } };

    await protect(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should throw an error if no token is provided", async () => {
    req.headers = { authorization: "" };

    await protect(req, res, next);
    expect(next).toBeCalledWith(expect.objectContaining({ statusCode: 401 }));
  });
});
