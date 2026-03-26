import { describe, expect, it } from "vitest";
import {
  validateEmail,
  validateItemId,
  validateItemName,
  validatePassword,
  validatePrice,
  validatePurchaseDate,
} from "../../lib/validators";

describe("validateEmail", () => {
  it("returns valid true for a properly formatted email", () => {
    expect(validateEmail("student@example.edu")).toEqual({ valid: true });
  });

  it("returns invalid for empty or whitespace-only input", () => {
    expect(validateEmail("")).toEqual({ valid: false, error: "Email is required." });
    expect(validateEmail("   ")).toEqual({ valid: false, error: "Email is required." });
  });

  it("returns invalid when @ is missing", () => {
    expect(validateEmail("student.example.edu")).toEqual({
      valid: false,
      error: "Email format is invalid.",
    });
  });

  it("returns invalid when . is missing after @", () => {
    expect(validateEmail("student@example")).toEqual({
      valid: false,
      error: "Email format is invalid.",
    });
  });
});

describe("validatePassword", () => {
  it("returns valid true when password has at least 6 characters", () => {
    expect(validatePassword("abc123")).toEqual({ valid: true });
  });

  it("returns invalid for empty password", () => {
    expect(validatePassword("")).toEqual({ valid: false, error: "Password is required." });
  });

  it("returns invalid for whitespace-only password", () => {
    expect(validatePassword("      ")).toEqual({
      valid: false,
      error: "Password cannot be only whitespace.",
    });
  });

  it("returns invalid for short password", () => {
    expect(validatePassword("abc12")).toEqual({
      valid: false,
      error: "Password must be at least 6 characters.",
    });
  });
});

describe("validateItemName", () => {
  it("returns valid true for non-empty trimmed name", () => {
    expect(validateItemName("Laptop")).toEqual({ valid: true });
  });

  it("returns invalid for null or undefined name", () => {
    expect(validateItemName(null)).toEqual({ valid: false, error: "Item name is required." });
    expect(validateItemName(undefined)).toEqual({
      valid: false,
      error: "Item name is required.",
    });
  });

  it("returns invalid for empty name", () => {
    expect(validateItemName("")).toEqual({ valid: false, error: "Item name cannot be empty." });
  });

  it("returns invalid for whitespace-only name", () => {
    expect(validateItemName("   ")).toEqual({
      valid: false,
      error: "Item name cannot be empty.",
    });
  });
});

describe("validateItemId", () => {
  it("returns valid true for non-empty id", () => {
    expect(validateItemId("item-123")).toEqual({ valid: true });
  });

  it("returns invalid for empty id", () => {
    expect(validateItemId("")).toEqual({ valid: false, error: "Item ID is required." });
  });

  it("returns invalid for whitespace-only id", () => {
    expect(validateItemId("   ")).toEqual({ valid: false, error: "Item ID is required." });
  });

  it("returns invalid for null or undefined id", () => {
    expect(validateItemId(null)).toEqual({ valid: false, error: "Item ID is required." });
    expect(validateItemId(undefined)).toEqual({ valid: false, error: "Item ID is required." });
  });
});

describe("validatePrice", () => {
  it("returns valid true for a positive numeric string", () => {
    expect(validatePrice("19.99")).toEqual({ valid: true });
  });

  it("returns valid true for empty, null, or undefined because price is optional", () => {
    expect(validatePrice("")).toEqual({ valid: true, error: undefined });
    expect(validatePrice(null)).toEqual({ valid: true, error: undefined });
    expect(validatePrice(undefined)).toEqual({ valid: true, error: undefined });
  });

  it("returns invalid for non-numeric price", () => {
    expect(validatePrice("abc")).toEqual({ valid: false, error: "Price must be a number." });
  });

  it("returns invalid for negative price", () => {
    expect(validatePrice("-1")).toEqual({ valid: false, error: "Price cannot be negative." });
  });
});

describe("validatePurchaseDate", () => {
  it("returns valid true for a real YYYY-MM-DD date", () => {
    expect(validatePurchaseDate("2026-03-15")).toEqual({ valid: true });
  });

  it("returns valid true for empty, null, or undefined because date is optional", () => {
    expect(validatePurchaseDate("")).toEqual({ valid: true });
    expect(validatePurchaseDate(null)).toEqual({ valid: true });
    expect(validatePurchaseDate(undefined)).toEqual({ valid: true });
  });

  it("returns invalid for wrong date format", () => {
    expect(validatePurchaseDate("03/15/2026")).toEqual({
      valid: false,
      error: "Date must be in YYYY-MM-DD format.",
    });
  });

  it("returns invalid for non-real calendar date", () => {
    expect(validatePurchaseDate("2026-13-45")).toEqual({
      valid: false,
      error: "Date must be a real calendar date.",
    });
  });
});
