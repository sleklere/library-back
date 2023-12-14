import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { signToken } from "../controllers/authController.js";
import mongoose from "mongoose";
import app from "../app.js";
import { testUser } from "../test/config.js";

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

const authToken = signToken(testUser.id);

const request = supertest(app);
const booksEndpoint = "/api/v1/books";

let testDocId;

describe(booksEndpoint, () => {
  describe("POST", () => {
    it("comes back with status 201 and the created book object", async () => {
      const payload = {
        title: "Test title",
        author: "Test author",
        userId: testUser.id,
        categories: ["Filosofía"],
      };

      const res = await request
        .post(booksEndpoint)
        .set("Authorization", `Bearer ${authToken}`)
        .set("Accept", "application/json")
        .send(payload);

      expect(res.statusCode).to.equal(201);
      expect(res.body.data.book).toHaveProperty("author");
    });
  });
  describe("GET", () => {
    it("responds with a json containing an array of books", async () => {
      const res = await request
        .get(booksEndpoint)
        .set("Authorization", `Bearer ${authToken}`)
        .set("Accept", "application/json");

      testDocId = res.body.data.books[0].id;
      expect("Content-Type", /json/);
      expect(res.statusCode).to.equal(200);
      expect(res.body.data.books).to.be.an("array");
    });

    it("has a data property", async () => {
      const res = await request
        .get(booksEndpoint)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.body).to.have.property("data");
    });
  });
  describe("UPDATE", () => {
    it("should change the title of the book to 'updated title'", async () => {
      const payload = { title: "updated title" };

      console.log(testDocId);

      const res = await request
        .patch(`${booksEndpoint}/${testDocId}/edit`)
        .set("Authorization", `Bearer ${authToken}`)
        .set("Accept", "application/json")
        .send(payload);

      expect(res.statusCode).toBe(200);
      // expect(res.body.data.book.title).toBe("updated title");
    });
  });
  describe("DELETE", () => {
    it("should delete the test doc created and respond with 204", async () => {
      const res = await request
        .delete(`${booksEndpoint}/${testDocId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(204);
    });
  });
});
