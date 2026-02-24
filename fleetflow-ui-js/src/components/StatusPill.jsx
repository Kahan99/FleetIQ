




const statusConfig = {
  available: { label: "Available", classes: "bg-[#16A34A]/10 text-[#16A34A]" },
  active: { label: "Active", classes: "bg-[#16A34A]/10 text-[#16A34A]" },
  on_trip: { label: "On Trip", classes: "bg-[#2563EB]/10 text-[#2563EB]" },
  in_use: { label: "In Use", classes: "bg-[#2563EB]/10 text-[#2563EB]" },
  in_progress: {
    label: "In Progress",
    classes: "bg-[#F59E0B]/10 text-[#F59E0B]"
  },
  in_service: { label: "In Service", classes: "bg-gray-100 text-gray-500" },
  in_shop: { label: "In Shop", classes: "bg-[#F59E0B]/10 text-[#F59E0B]" },
  maintenance: {
    label: "Maintenance",
    classes: "bg-[#F59E0B]/10 text-[#F59E0B]"
  },
  scheduled: { label: "Scheduled", classes: "bg-[#2563EB]/10 text-[#2563EB]" },
  out_of_service: {
    label: "Out of Service",
    classes: "bg-[#DC2626]/10 text-[#DC2626]"
  },
  on_duty: { label: "On Duty", classes: "bg-[#16A34A]/10 text-[#16A34A]" },
  off_duty: { label: "Off Duty", classes: "bg-gray-100 text-gray-400" },
  suspended: { label: "Suspended", classes: "bg-[#DC2626]/10 text-[#DC2626]" },
  dispatched: {
    label: "Dispatched",
    classes: "bg-[#2563EB]/10 text-[#2563EB]"
  },
  completed: { label: "Completed", classes: "bg-[#16A34A]/10 text-[#16A34A]" },
  cancelled: { label: "Cancelled", classes: "bg-[#DC2626]/10 text-[#DC2626]" },
  draft: { label: "Draft", classes: "bg-gray-100 text-gray-500" },
  inactive: { label: "Inactive", classes: "bg-gray-100 text-gray-400" },
  retired: { label: "Retired", classes: "bg-gray-100 text-gray-400" },
  overdue: { label: "Overdue", classes: "bg-[#DC2626]/10 text-[#DC2626]" }
};

export function StatusPill({ status, size = "sm" }) {
  const config = statusConfig[status] || {
    label: status?.replace(/_/g, " ") || "Unknown",
    classes: "bg-gray-100 text-gray-500"
  };

  return (
    <span
      className={`${size === "sm" ? "text-[11px] px-2.5 py-1" : "text-xs px-3 py-1.5"} font-semibold rounded-full capitalize ${config.classes}`}>
      
      {config.label}
    </span>);

}