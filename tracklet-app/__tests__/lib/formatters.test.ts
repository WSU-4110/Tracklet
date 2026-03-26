import {
  capitalizeFirstLetter,
  formatDate,
  formatItemDetails,
  formatPrice,
  formatUserName,
  truncateText,
} from "@/lib/formatters";

describe("formatPrice", () => {
  it("formats numeric values with exactly two decimals", () => {
    expect(formatPrice(12.9)).toBe("$12.90");
  });

  it("formats numeric strings with exactly two decimals", () => {
    expect(formatPrice("12.99")).toBe("$12.99");
  });

  it("returns empty string for null and undefined", () => {
    expect(formatPrice(null)).toBe("");
    expect(formatPrice(undefined)).toBe("");
  });

  it("returns empty string for non-numeric strings", () => {
    expect(formatPrice("not-a-number")).toBe("");
  });
});

describe("formatDate", () => {
  it("formats a valid YYYY-MM-DD date string", () => {
    expect(formatDate("2026-03-01")).toBe("Mar 1, 2026");
  });

  it("returns empty string for null, undefined, and empty string", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
    expect(formatDate("")).toBe("");
  });

  it("returns the original string for invalid date format", () => {
    expect(formatDate("03/01/2026")).toBe("03/01/2026");
  });

  it("returns the original string for impossible calendar dates", () => {
    expect(formatDate("2026-02-30")).toBe("2026-02-30");
  });
});

describe("formatItemDetails", () => {
  it("joins all provided parts with bullets", () => {
    expect(
      formatItemDetails("Best Buy", "2026-03-01", "Electronics"),
    ).toBe("Best Buy • 2026-03-01 • Electronics");
  });

  it("uses Unknown store when store is null", () => {
    expect(formatItemDetails(null, "2026-03-01", "Electronics")).toBe(
      "Unknown store • 2026-03-01 • Electronics",
    );
  });

  it("omits date and category when they are null", () => {
    expect(formatItemDetails("Best Buy", null, null)).toBe("Best Buy");
  });

  it("includes only non-null optional parts", () => {
    expect(formatItemDetails("Best Buy", null, "Electronics")).toBe(
      "Best Buy • Electronics",
    );
  });
});

describe("formatUserName", () => {
  it("returns full name when first and last are provided", () => {
    expect(formatUserName("Ada", "Lovelace")).toBe("Ada Lovelace");
  });

  it("returns first name when last name is missing", () => {
    expect(formatUserName("Ada", null)).toBe("Ada");
  });

  it("returns last name when first name is missing", () => {
    expect(formatUserName(undefined, "Lovelace")).toBe("Lovelace");
  });

  it("returns User when both names are empty or missing", () => {
    expect(formatUserName("", "")).toBe("User");
    expect(formatUserName(null, undefined)).toBe("User");
  });
});

describe("truncateText", () => {
  it("returns text as-is when length is within maxLength", () => {
    expect(truncateText("hello", 5)).toBe("hello");
  });

  it("truncates and appends ellipsis when text exceeds maxLength", () => {
    expect(truncateText("hello world", 8)).toBe("hello...");
  });

  it("returns empty string for empty, null, and undefined", () => {
    expect(truncateText("", 5)).toBe("");
    expect(truncateText(null, 5)).toBe("");
    expect(truncateText(undefined, 5)).toBe("");
  });

  it("returns only ellipsis when maxLength is below 3 and text exceeds it", () => {
    expect(truncateText("hello", 2)).toBe("...");
  });
});

describe("capitalizeFirstLetter", () => {
  it("capitalizes first letter and lowercases the rest", () => {
    expect(capitalizeFirstLetter("hELLO")).toBe("Hello");
  });

  it("handles single-character strings", () => {
    expect(capitalizeFirstLetter("a")).toBe("A");
  });

  it("returns empty string for empty, null, and undefined", () => {
    expect(capitalizeFirstLetter("")).toBe("");
    expect(capitalizeFirstLetter(null)).toBe("");
    expect(capitalizeFirstLetter(undefined)).toBe("");
  });

  it("keeps already-capitalized words normalized", () => {
    expect(capitalizeFirstLetter("Tracklet")).toBe("Tracklet");
  });
});
