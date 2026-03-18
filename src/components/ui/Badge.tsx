interface BadgeProps {
  label: string;
  variant?:
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "default";
}

const variants = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  default: "bg-gray-100 text-gray-700",
};

export default function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {label}
    </span>
  );
}

// Status badge helpers
export const getOrderStatusBadge = (status: string) => {
  const map: Record<string, { label: string; variant: BadgeProps["variant"] }> =
    {
      PENDING_PAYMENT: { label: "Payment Pending", variant: "warning" },
      PAID: { label: "Paid", variant: "info" },
      READY_FOR_PICKUP: { label: "Ready for Pickup", variant: "info" },
      SHIPPED: { label: "Shipped", variant: "info" },
      COMPLETED: { label: "Completed", variant: "success" },
      CANCELLED: { label: "Cancelled", variant: "danger" },
    };
  return map[status] ?? { label: status, variant: "default" };
};

export const getListingStatusBadge = (status: string) => {
  const map: Record<string, { label: string; variant: BadgeProps["variant"] }> =
    {
      PENDING_APPROVAL: { label: "Pending Approval", variant: "warning" },
      ACTIVE: { label: "Active", variant: "success" },
      CLOSED: { label: "Closed", variant: "default" },
      REJECTED: { label: "Rejected", variant: "danger" },
    };
  return map[status] ?? { label: status, variant: "default" };
};

export const getBidStatusBadge = (status: string) => {
  const map: Record<string, { label: string; variant: BadgeProps["variant"] }> =
    {
      PENDING: { label: "Pending", variant: "warning" },
      ACCEPTED: { label: "Accepted", variant: "success" },
      REJECTED: { label: "Rejected", variant: "danger" },
    };
  return map[status] ?? { label: status, variant: "default" };
};