export const Roles = {
  FARMER: "FARMER",
  BUYER: "BUYER",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
