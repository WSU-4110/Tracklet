export type ValidationResult = { valid: boolean; error?: string };

export function validateEmail(email: string): ValidationResult {
  if (typeof email !== "string" || email.trim() === "") {
    return { valid: false, error: "Email is required." };
  }

  const trimmedEmail = email.trim();
  const atIndex = trimmedEmail.indexOf("@");
  const dotIndex = trimmedEmail.lastIndexOf(".");

  const hasTextBeforeAt = atIndex > 0;
  const hasTextAfterAt = atIndex >= 0 && atIndex < trimmedEmail.length - 1;
  const hasDotAfterAt = dotIndex > atIndex + 1 && dotIndex < trimmedEmail.length - 1;

  if (!hasTextBeforeAt || !hasTextAfterAt || !hasDotAfterAt) {
    return { valid: false, error: "Email format is invalid." };
  }

  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (typeof password !== "string" || password === "") {
    return { valid: false, error: "Password is required." };
  }

  if (password.trim() === "") {
    return { valid: false, error: "Password cannot be only whitespace." };
  }

  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters." };
  }

  return { valid: true };
}

export function validateItemName(name: string | null | undefined): ValidationResult {
  if (typeof name !== "string") {
    return { valid: false, error: "Item name is required." };
  }

  if (name.trim() === "") {
    return { valid: false, error: "Item name cannot be empty." };
  }

  return { valid: true };
}

export function validateItemId(id: string | null | undefined): ValidationResult {
  if (typeof id !== "string" || id.trim() === "") {
    return { valid: false, error: "Item ID is required." };
  }

  return { valid: true };
}

export function validatePrice(price: string | null | undefined): ValidationResult {
  if (price == null || price.trim() === "") {
    return { valid: true, error: undefined };
  }

  const parsedPrice = parseFloat(price);

  if (Number.isNaN(parsedPrice)) {
    return { valid: false, error: "Price must be a number." };
  }

  if (parsedPrice < 0) {
    return { valid: false, error: "Price cannot be negative." };
  }

  return { valid: true };
}

export function validatePurchaseDate(date: string | null | undefined): ValidationResult {
  if (date == null || date.trim() === "") {
    return { valid: true };
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(date)) {
    return { valid: false, error: "Date must be in YYYY-MM-DD format." };
  }

  const [yearString, monthString, dayString] = date.split("-");
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  const isRealDate =
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() + 1 === month &&
    parsedDate.getUTCDate() === day;

  if (!isRealDate) {
    return { valid: false, error: "Date must be a real calendar date." };
  }

  return { valid: true };
}
