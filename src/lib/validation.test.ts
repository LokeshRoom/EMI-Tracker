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
});
