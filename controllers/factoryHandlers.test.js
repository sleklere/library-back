import { describe, expect, it, vi } from "vitest";
// import { describe, expect, it, vi } from "jest";
import { createOne } from "./factoryHandlers.js";
import User from "../models/User.js";
import Book from "../models/Book.js";

vi.mock("../models/User.js");
vi.mock("../models/Book.js");

const req = {
  body: { email: "fake_email", password: "fake_password" },
};
const res = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn(x => x),
};

const next = vi.fn(x => x);

describe("createOne()", () => {
  it("should return a status code of 201 when new doc is created", async () => {
    // arrange
    const DocToTest = User;
    DocToTest.create.mockResolvedValueOnce({
      id: 1,
      email: "result_email",
      password: "result_password",
    });

    // act
    const createDoc = createOne(DocToTest);
    await createDoc(req, res, next);

    // assert
    expect(DocToTest.create).toBeCalledWith(req.body);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalled();
  });
  it("should throw an AppError with status 400 if no doc is created", async () => {
    const createDoc = createOne(Book);
    await createDoc(req, res, next);

    expect(next).toBeCalled();
    expect(next).toBeCalledWith(expect.objectContaining({ statusCode: 400 }));
  });
});
