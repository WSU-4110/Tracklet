export function formatPrice(price: string | number | null | undefined): string {
  if (price === null || price === undefined) {
    return "";
  }

  const parsedPrice = typeof price === "number" ? price : Number(price);
  if (Number.isNaN(parsedPrice)) {
    return "";
  }

  return `$${parsedPrice.toFixed(2)}`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return "";
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateString)) {
    return dateString;
  }

  const [yearString, monthString, dayString] = dateString.split("-");
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  const date = new Date(Date.UTC(year, month - 1, day));

  // Guard against impossible dates like 2026-02-30.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatItemDetails(
  store: string | null,
  date: string | null,
  category: string | null,
): string {
  const parts = [store ?? "Unknown store"];

  if (date !== null) {
    parts.push(date);
  }

  if (category !== null) {
    parts.push(category);
  }

  return parts.join(" • ");
}

export function formatUserName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
): string {
  const safeFirstName = firstName?.trim() ?? "";
  const safeLastName = lastName?.trim() ?? "";

  if (safeFirstName && safeLastName) {
    return `${safeFirstName} ${safeLastName}`;
  }

  if (safeFirstName) {
    return safeFirstName;
  }

  if (safeLastName) {
    return safeLastName;
  }

  return "User";
}

export function truncateText(
  text: string | null | undefined,
  maxLength: number,
): string {
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  if (maxLength < 3) {
    return "...";
  }

  return `${text.slice(0, maxLength - 3)}...`;
}

export function capitalizeFirstLetter(text: string | null | undefined): string {
  if (!text) {
    return "";
  }

  if (text.length === 1) {
    return text.toUpperCase();
  }

  return `${text[0].toUpperCase()}${text.slice(1).toLowerCase()}`;
}
