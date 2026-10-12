import { z } from "zod";
import { isAmountInput, isValidStartMonth } from "./money";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const requiredAmount = z
  .string()
  .refine((value) => value.trim() !== "" && isAmountInput(value), {
    message: "Enter an amount like 1000 or 1000.50.",
  });

const optionalAmount = z
  .string()
  .refine((value) => value.trim() === "" || isAmountInput(value), {
    message: "Enter an amount like 1000 or 1000.50.",
  });

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required.").max(80, "Keep name under 80 characters."),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Keep password under 100 characters."),
});

export const cardFormSchema = z.object({
  bankName: z.string().min(1, "Bank name is required.").max(80, "Keep bank name under 80 characters."),
  cardLabel: z.string().min(1, "Card label is required.").max(60, "Keep card label under 60 characters."),
  last4: z.string().regex(/^\d{4}$/, "Enter the last 4 digits."),
  currency: z.string().length(3, "Use a 3-letter currency code.").transform((value) => value.toUpperCase()),
  cardOwner: z.string().max(80, "Keep card owner under 80 characters."),
  creditLimit: optionalAmount,
  outstandingBalance: optionalAmount,
  paymentDueDay: z.string().refine((val) => {
    const trimmed = val.trim();
    if (!trimmed) return true;
    const n = Number(trimmed);
    return Number.isInteger(n) && n >= 1 && n <= 31;
  }, {
    message: "Enter a payment due day between 1 and 31.",
  }),
  authorizedUserIds: z.string(),
});

export const cardholderFormSchema = z.object({
  name: z.string().min(1, "Name is required.").max(80, "Keep name under 80 characters."),
  phone: z.string().max(20, "Keep phone under 20 characters."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(120, "Keep email under 120 characters."),
});

export const emiSplitSchema = z.object({
  cardholderId: z.string().min(1, "Select a cardholder."),
  percentage: z.number().min(0.01, "Share must be > 0%").max(100, "Share cannot exceed 100%"),
});

export const emiFormSchema = z.object({
  cardholderId: z.string().min(1, "Select a cardholder."),
  splits: z.array(emiSplitSchema).optional(),
  paidInstallmentsCount: z.string().refine((val) => {
    const trimmed = val.trim();
    if (!trimmed) return true;
    const n = Number(trimmed);
    return Number.isInteger(n) && n >= 0 && n <= 1000;
  }, {
    message: "Enter a number of installments between 0 and 1000.",
  }),
  merchantName: z.string().min(1, "Merchant name is required.").max(80, "Keep merchant name under 80 characters."),
  purchaseDate: z.string().refine((value) => datePattern.test(value), {
    message: "Select a purchase date.",
  }),
  principalAmount: requiredAmount,
  downPayment: optionalAmount,
  interestRateAnnualPercent: z
    .string()
    .refine((value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100;
    }, {
      message: "Enter an annual rate between 0 and 100.",
    }),
  tenureMonths: z
    .string()
    .refine((value) => {
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed > 0 && parsed <= 1000;
    }, {
      message: "Enter tenure between 1 and 1000 months.",
    }),
  startMonth: z
    .string()
    .refine((value) => isValidStartMonth(value), {
      message: "Select a valid start month (YYYY-MM).",
    }),
  processingCharge: optionalAmount,
  additionalCost: optionalAmount,
  additionalCostFrequency: z.enum(["one_time", "monthly"]),
  status: z.enum(["active", "closed"]),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type CardFormValues = z.infer<typeof cardFormSchema>;
export type CardholderFormValues = z.infer<typeof cardholderFormSchema>;
export type EmiFormValues = z.infer<typeof emiFormSchema>;
