import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./firebase";
import { computeAccessChanges, isCardMember } from "./firebase-data";
import type { Card } from "@/types";

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: "card-1",
    bankName: "HDFC",
    cardLabel: "Regalia",
    last4: "1234",
    currency: "INR",
    outstandingBalanceCents: 0,
    ownerUid: "owner-uid",
    userIds: ["owner-uid", "member-uid"],
    ...overrides,
  };
}

describe("isCardMember", () => {
  it("returns true for a member uid", () => {
    expect(isCardMember(makeCard(), "member-uid")).toBe(true);
  });

  it("returns false for an outsider uid", () => {
    expect(isCardMember(makeCard(), "outsider-uid")).toBe(false);
  });

  it("returns false when no uid is provided", () => {
    expect(isCardMember(makeCard())).toBe(false);
  });

  it("handles a missing userIds field safely", () => {
    expect(isCardMember(makeCard({ userIds: undefined }), "member-uid")).toBe(false);
  });
});

describe("getErrorMessage", () => {
  it("maps permission-denied to a friendly message without leaking internals", () => {
    const err = Object.assign(new Error("Permission denied (firestore.googleapis.com)"), {
      code: "permission-denied",
    });
    expect(getErrorMessage(err)).toBe("You don't have access to this data.");
  });

  it("maps unauthenticated to a friendly message", () => {
    const err = Object.assign(new Error("Unauthenticated"), { code: "unauthenticated" });
    expect(getErrorMessage(err)).toBe("Please sign in again.");
  });

  it("does not leak arbitrary object messages", () => {
    expect(
      getErrorMessage({ message: "internal detail should not leak" })
    ).toBe("Something went wrong. Please try again.");
  });

  it("keeps generic Error messages intact", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });
});

describe("computeAccessChanges", () => {
  it("reports newly added users, excluding the owner", () => {
    const result = computeAccessChanges(["owner"], ["owner", "alice", "bob"], "owner");
    expect(result.added).toEqual(["alice", "bob"]);
    expect(result.removed).toEqual([]);
  });

  it("reports removed users, excluding the owner", () => {
    const result = computeAccessChanges(["owner", "alice"], ["owner"], "owner");
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual(["alice"]);
  });

  it("returns empty changes when membership is unchanged (order-insensitive)", () => {
    const result = computeAccessChanges(["owner", "alice"], ["alice", "owner"], "owner");
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual([]);
  });

  it("never reports the owner as added or removed", () => {
    const result = computeAccessChanges(["owner"], ["owner", "newbie"], "owner");
    expect(result.added).not.toContain("owner");
    expect(result.removed).not.toContain("owner");
  });
});
