import supertest from "supertest";
import { signToken } from "./authController.js";
import app from "../app.js";
import { it, describe, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";

const request = supertest(app);

beforeAll(() => {
  const database = process.env.DB.replace(
    "<PASSWORD>",
    process.env.DB_PASSWORD,
  );

  mongoose
    .connect(database)
    .then(() => console.log("Database connection successful"));
});

afterAll(() => {
  mongoose.disconnect();
});

describe("PROTECT MIDDLEWARE", () => {
  const authToken = signToken("650330e518616d0affa8d0c9");

  it("should protect routes with valid token", async () => {
    const res = await request
      .get("/api/v1/books")
      .set("Authorization", `Bearer ${authToken}`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(200);
  });

  // it("should reject requests without a token", async () => {
  //   // Make a request without a token
  //   const res = await request
  //     .get("/api/v1/books")
  //     .set("Accept", "application/json");
  //   // .set("Authorization", `Bearer ${authToken}`);

  //   expect(res.status).to.equal(401);
  // });
});
