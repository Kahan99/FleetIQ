interface StatusPillProps {
  status: string;
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  available: {
    label: "Available",
    classes: "bg-green-50 text-green-700 border-green-200",
  },
  on_trip: {
    label: "On Trip",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
  },
  in_service: {
    label: "In Service",
    classes: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  maintenance: {
    label: "Maintenance",
    classes: "bg-red-50 text-red-700 border-red-200",
  },
  in_use: {
    label: "In Use",
    classes: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  out_of_service: {
    label: "Out of Service",
    classes: "bg-red-50 text-red-700 border-red-200",
  },
  on_duty: {
    label: "On Duty",
    classes: "bg-green-50 text-green-700 border-green-200",
  },
  off_duty: {
    label: "Off Duty",
    classes: "bg-gray-50 text-gray-700 border-gray-200",
  },
  suspended: {
    label: "Suspended",
    classes: "bg-orange-50 text-orange-700 border-orange-200",
  },
  dispatched: {
    label: "Dispatched",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Completed",
    classes: "bg-green-50 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-50 text-red-700 border-red-200",
  },
  draft: {
    label: "Draft",
    classes: "bg-gray-50 text-gray-700 border-gray-200",
  },
};

export function StatusPill({ status }: StatusPillProps) {
  const config = statusConfig[status] || {
    label: status,
    classes: "bg-gray-50 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-bold rounded-full border ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
