const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

export function isAmountInput(value: string): boolean {
  const trimmed = value.trim().replace(/,/g, "");
  return trimmed === "" || AMOUNT_PATTERN.test(trimmed);
}

export function parseCents(value: string): number {
  const trimmed = value.trim().replace(/,/g, "");
  if (trimmed === "") return 0;
  if (!AMOUNT_PATTERN.test(trimmed)) {
    throw new Error("Amount must be a positive number with up to 2 decimal places.");
  }

  const [whole = "0", fraction = ""] = trimmed.split(".");
  const paddedFraction = `${fraction}00`.slice(0, 2);
  return Number(whole) * 100 + Number(paddedFraction);
}

export function formatCents(cents: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function isValidStartMonth(value: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

export function currentStartMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function monthLabelFromStartMonth(startMonth: string, offset: number): string {
  const [year, month] = startMonth.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
