import { describe, it, expect } from "vitest";
import { handleCastErrorDB } from "./globalErrorHandler";
import AppError from "../utils/appError";

describe("handleCastErrorDB()", () => {
  it("should return an AppError instance", () => {
    const res = handleCastErrorDB({ path: "test path", value: "test value" });
    expect(res).toBeInstanceOf(AppError);
  });
});
