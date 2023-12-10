import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { signToken } from "../controllers/authController.js";
import mongoose from "mongoose";
import app from "../app.js";

/*

at least at the current date (12th december 2023) this is how the testing setup is working

- The first and i think better way is to just import app.js (not server.js), connect to the db before all tests (this could be helpful to connect to the testing db, not the production one), run supertest(app) one time for all tests in the file and then perform the desired tests

*/

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

const authToken = signToken("650330e518616d0affa8d0c9");

const request = supertest(app);

describe("GET endpoints", () => {
  describe("/api/v1/books/", () => {
    it("responds with a json containing an array of books", async () => {
      const res = await request
        .get("/api/v1/books/")
        .set("Authorization", `Bearer ${authToken}`)
        .set("Accept", "application/json");
      expect("Content-Type", /json/);
      expect(res.status).to.equal(200);
      expect(res.body.data.books).to.be.an("array");
    });

    it("has a data property", async () => {
      const authToken = signToken("650330e518616d0affa8d0c9");
      const res = await request
        .get("/api/v1/books/")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.body).to.have.property("data");
    });
  });
});
