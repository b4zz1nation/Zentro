import { describe, expect, it, vi } from "vitest";
import { computeMembershipStatus, membershipHistoryLabel } from "@/lib/memberships/status";

describe("computeMembershipStatus", () => {
  it("returns suspended before any date logic", () => {
    expect(
      computeMembershipStatus({
        status: "suspended",
        paymentStatus: "paid",
        startAt: "2026-01-01T00:00:00.000Z",
        endAt: "2026-12-31T00:00:00.000Z",
      }),
    ).toBe("suspended");
  });

  it("returns frozen before any date logic", () => {
    expect(
      computeMembershipStatus({
        status: "frozen",
        paymentStatus: "paid",
        startAt: "2026-01-01T00:00:00.000Z",
        endAt: "2026-12-31T00:00:00.000Z",
      }),
    ).toBe("frozen");
  });

  it("returns pending payment before date status", () => {
    expect(
      computeMembershipStatus({
        status: "active",
        paymentStatus: "pending",
        startAt: "2026-01-01T00:00:00.000Z",
        endAt: "2026-12-31T00:00:00.000Z",
      }),
    ).toBe("pending_payment");
  });

  it("returns inactive when membership has not started yet", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-03T12:00:00.000Z"));

    expect(
      computeMembershipStatus({
        status: "active",
        paymentStatus: "paid",
        startAt: "2026-05-01T00:00:00.000Z",
        endAt: "2026-06-01T00:00:00.000Z",
      }),
    ).toBe("inactive");

    vi.useRealTimers();
  });

  it("returns expired when membership already ended", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-03T12:00:00.000Z"));

    expect(
      computeMembershipStatus({
        status: "active",
        paymentStatus: "paid",
        startAt: "2026-01-01T00:00:00.000Z",
        endAt: "2026-03-01T00:00:00.000Z",
      }),
    ).toBe("expired");

    vi.useRealTimers();
  });

  it("returns trial when trial membership is currently valid", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-03T12:00:00.000Z"));

    expect(
      computeMembershipStatus({
        status: "trial",
        paymentStatus: "paid",
        startAt: "2026-04-01T00:00:00.000Z",
        endAt: "2026-04-10T00:00:00.000Z",
      }),
    ).toBe("trial");

    vi.useRealTimers();
  });
});

describe("membershipHistoryLabel", () => {
  it("formats underscored statuses for display", () => {
    expect(
      membershipHistoryLabel({
        status: "active",
        paymentStatus: "pending",
        startAt: "2026-01-01T00:00:00.000Z",
        endAt: "2026-12-31T00:00:00.000Z",
      }),
    ).toBe("pending payment");
  });
});
