import type { MemberHistoryItem } from "@/lib/members/service";

export type MembershipStatus =
  | "active"
  | "expired"
  | "inactive"
  | "suspended"
  | "frozen"
  | "pending_payment"
  | "trial";

export function computeMembershipStatus(input: {
  status: MembershipStatus;
  paymentStatus: string;
  startAt: string;
  endAt: string;
}) {
  const now = Date.now();
  const startAt = new Date(input.startAt).getTime();
  const endAt = new Date(input.endAt).getTime();

  if (input.status === "suspended") return "suspended";
  if (input.status === "frozen") return "frozen";
  if (input.paymentStatus === "pending") return "pending_payment";
  if (now < startAt) return "inactive";
  if (now > endAt) return "expired";
  if (input.status === "trial") return "trial";
  return "active";
}

export function membershipHistoryLabel(item: {
  status: MembershipStatus;
  paymentStatus: string;
  startAt: string;
  endAt: string;
}) {
  return computeMembershipStatus(item).replaceAll("_", " ");
}

export function summarizeMembershipHistory(items: MemberHistoryItem[]) {
  return items.length === 0 ? "No memberships yet." : `${items.length} membership record(s) loaded.`;
}
