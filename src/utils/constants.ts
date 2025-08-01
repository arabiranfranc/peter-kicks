export const ITEM_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  CANCELLED: "cancelled",
  IN_TRANSIT: "in_transit",
  COMPLETED: "completed",
  DECLINED: "declined",
} as const;

export type ItemStatus = (typeof ITEM_STATUS)[keyof typeof ITEM_STATUS];

export const ITEM_WEAR = {
  BRAND_NEW: "brand-new",
  VNDS: "vnds",
  UIGC: "uigc",
  BEATERS: "beaters",
} as const;

export type ItemWear = (typeof ITEM_WEAR)[keyof typeof ITEM_WEAR];

export const ITEM_SORT_BY = {
  NEWEST_FIRST: "newest",
  OLDEST_FIRST: "oldest",
  ASCENDING: "a-z",
  DESCENDING: "z-a",
} as const;

export type ItemSortBy = (typeof ITEM_SORT_BY)[keyof typeof ITEM_SORT_BY];
