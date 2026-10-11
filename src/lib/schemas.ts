import { z } from "zod";
import { isAmountInput, isValidStartMonth, parseCents } from "./money";

function isNonNegativeAmount(value: string): boolean {
  return isAmountInput(value) && parseCents(value) >= 0;
}

function isPositiveAmount(value: string): boolean {
  return isAmountInput(value) && parseCents(value) > 0;
}

function isInterestRate(value: string): boolean {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100;
}

function isTenure(value: string): boolean {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 360;
}

const amountField = z
  .string()
  .refine(isNonNegativeAmount, {
    message: "Enter an amount like 0, 1200, or 1200.50.",
  });

const positiveAmountField = z
  .string()
  .refine(isPositiveAmount, {
    message: "Enter an amount greater than zero.",
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const signupSchema = z
  .object({
    displayName: z.string().trim().min(1, "Display name is required."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const cardSchema = z.object({
  bankName: z.string().trim().min(1, "Bank name is required."),
  cardLabel: z.string().trim().min(1, "Card label is required."),
  last4: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter exactly 4 digits."),
  currency: z
    .string()
    .trim()
    .length(3, "Enter a 3-letter currency code."),
  creditLimit: amountField,
  outstandingBalance: amountField,
  authorizedUserIds: z
    .string()
    .trim()
    .refine((value) => {
      if (value === "") return true;
      return value.split(",").every((uid) => uid.trim().length > 0);
    }, {
      message: "Separate Firebase UIDs with commas.",
    }),
});

export const cardholderSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  phone: z
    .string()
    .trim()
    .refine((value) => {
      if (value === "") return true;
      return /^[+\d][\d\s-]{6,15}$/.test(value);
    }, {
      message: "Enter a valid phone number.",
    }),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .or(z.literal("")),
});

export const emiSchema = z.object({
  cardholderId: z.string().min(1, "Select a cardholder."),
  merchantName: z.string().trim().min(1, "Merchant name is required."),
  purchaseDate: z.string().min(1, "Purchase date is required."),
  principalAmount: positiveAmountField,
  downPayment: amountField,
  interestRateAnnualPercent: z
    .string()
    .refine(isInterestRate, {
      message: "Enter an annual rate from 0 to 100.",
    }),
  tenureMonths: z
    .string()
    .refine(isTenure, {
      message: "Enter a whole number of months from 1 to 360.",
    }),
  startMonth: z
    .string()
    .refine(isValidStartMonth, {
      message: "Select a valid start month.",
    }),
  processingCharge: amountField,
  additionalCost: amountField,
  additionalCostFrequency: z.enum(["one_time", "monthly"]),
  status: z.enum(["active", "closed"]),
});

export type LoginSchemaValues = z.infer<typeof loginSchema>;
export type SignupSchemaValues = z.infer<typeof signupSchema>;
export type CardSchemaValues = z.infer<typeof cardSchema>;
export type CardholderSchemaValues = z.infer<typeof cardholderSchema>;
export type EmiSchemaValues = z.infer<typeof emiSchema>;
