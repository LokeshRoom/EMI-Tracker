import { describe, expect, it } from "vitest";
import { cardholderFormSchema, cardFormSchema } from "./validation";

describe("cardholderFormSchema", () => {
  it("rejects when email is missing or empty", () => {
    const res = cardholderFormSchema.safeParse({
      name: "Alice",
      phone: "",
      email: "",
    });
    expect(res.success).toBe(false);
  });

  it("rejects when email is invalid", () => {
    const res = cardholderFormSchema.safeParse({
      name: "Alice",
      phone: "+91 9999999999",
      email: "not-an-email",
    });
    expect(res.success).toBe(false);
  });

  it("accepts valid name and required email", () => {
    const res = cardholderFormSchema.safeParse({
      name: "Alice",
      phone: "+91 9999999999",
      email: "alice@example.com",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.email).toBe("alice@example.com");
    }
  });
});

const cardBase = {
  bankName: "HDFC",
  cardLabel: "Regalia",
  last4: "1234",
  currency: "INR",
  cardOwner: "Self",
  creditLimit: "100000",
  outstandingBalance: "0",
  paymentDueDay: "15",
};

describe("cardFormSchema", () => {
  it("accepts INR as currency", () => {
    const res = cardFormSchema.safeParse({
      bankName: "HDFC",
      cardLabel: "Regalia",
      last4: "1234",
      currency: "INR",
      cardOwner: "Self",
      creditLimit: "100000",
      outstandingBalance: "0",
      paymentDueDay: "15",
      authorizedUserIds: "",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.currency).toBe("INR");
    }
  });

  it("accepts empty authorizedUserIds", () => {
    const res = cardFormSchema.safeParse({ ...cardBase, authorizedUserIds: "" });
    expect(res.success).toBe(true);
  });

  it("accepts valid Firebase UIDs separated by commas", () => {
    const res = cardFormSchema.safeParse({
      ...cardBase,
      authorizedUserIds: "AbCd1234567890123456, XYZ_999",
    });
    expect(res.success).toBe(true);
  });

  it("rejects UIDs containing spaces or other invalid characters", () => {
    const res = cardFormSchema.safeParse({ ...cardBase, authorizedUserIds: "not a uid" });
    expect(res.success).toBe(false);
  });

  it("rejects UIDs with invalid characters", () => {
    const res = cardFormSchema.safeParse({ ...cardBase, authorizedUserIds: "abc@def" });
    expect(res.success).toBe(false);
  });

  it("rejects UIDs longer than 64 characters", () => {
    const res = cardFormSchema.safeParse({
      ...cardBase,
      authorizedUserIds: "a".repeat(65),
    });
    expect(res.success).toBe(false);
  });
});
