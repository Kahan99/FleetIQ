import { UserRole } from "@/context/AuthContext";

// All available routes
export type AppRoute =
  | "/dashboard"
  | "/vehicles"
  | "/trips"
  | "/drivers"
  | "/maintenance"
  | "/expenses"
  | "/analytics";

// What each role can access
export const ROLE_PERMISSIONS: Record<UserRole, AppRoute[]> = {
  fleet_manager: [
    "/dashboard",
    "/vehicles",
    "/trips",
    "/drivers",
    "/maintenance",
    "/expenses",
    "/analytics",
  ],
  dispatcher: ["/dashboard", "/trips", "/vehicles", "/drivers"],
  safety_officer: ["/dashboard", "/drivers", "/maintenance"],
  financial_analyst: ["/dashboard", "/vehicles", "/expenses", "/analytics"],
};

// Sidebar nav items per role
export interface NavItem {
  title: string;
  href: AppRoute;
  icon: string; // icon name to look up
  badge?: string;
}

export const ALL_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Vehicles", href: "/vehicles", icon: "Truck" },
  { title: "Trips", href: "/trips", icon: "Route" },
  { title: "Drivers", href: "/drivers", icon: "Users" },
  { title: "Maintenance", href: "/maintenance", icon: "Wrench" },
  { title: "Expenses", href: "/expenses", icon: "CreditCard" },
  { title: "Analytics", href: "/analytics", icon: "BarChart3" },
];

export function getNavItemsForRole(role: UserRole): NavItem[] {
  const allowed = ROLE_PERMISSIONS[role];
  return ALL_NAV_ITEMS.filter((item) => allowed.includes(item.href));
}

export function canAccess(role: UserRole, route: string): boolean {
  const allowed = ROLE_PERMISSIONS[role] as string[];
  return allowed.some(
    (allowedRoute) => route === allowedRoute || route.startsWith(`${allowedRoute}/`)
  );
}

// Role descriptions and colors for RBAC UI
export const ROLE_META: Record<
  UserRole,
  {
    label: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
    accentColor: string;
    capabilities: string[];
  }
> = {
  fleet_manager: {
    label: "Fleet Manager",
    description:
      "Full access to all fleet operations, reporting, and system configuration.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    accentColor: "bg-blue-600",
    capabilities: [
      "Vehicles",
      "Trips",
      "Drivers",
      "Maintenance",
      "Expenses",
      "Analytics",
    ],
  },
  dispatcher: {
    label: "Dispatcher",
    description:
      "Create, dispatch, and manage trips. Can view vehicles and drivers.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    accentColor: "bg-emerald-600",
    capabilities: ["Trips", "Vehicles (read)", "Drivers (read)", "Dashboard"],
  },
  safety_officer: {
    label: "Safety Officer",
    description:
      "Monitor driver safety, compliance, and vehicle maintenance records only.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    accentColor: "bg-amber-500",
    capabilities: ["Drivers", "Maintenance", "Dashboard"],
  },
  financial_analyst: {
    label: "Financial Analyst",
    description:
      "Access expense reports, ROI metrics, and vehicle cost data. Read-only.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    accentColor: "bg-purple-600",
    capabilities: ["Expenses", "Analytics", "Vehicles (read)", "Dashboard"],
  },
};
