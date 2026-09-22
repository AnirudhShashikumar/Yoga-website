export type NavigationItem = Readonly<{
  label: string;
  href: string;
}>;

export const publicNavigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Classes", href: "/classes" },
  { label: "Schedule", href: "/schedule" },
  { label: "Pricing", href: "/pricing" },
  { label: "Workshops", href: "/workshops" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const satisfies readonly NavigationItem[];

export const customerNavigation = [
  { label: "Overview", href: "/dashboard" },
  { label: "My Bookings", href: "/dashboard/bookings" },
  { label: "Explore Classes", href: "/dashboard/classes" },
  { label: "Schedule", href: "/dashboard/schedule" },
  { label: "Profile", href: "/dashboard/profile" },
] as const satisfies readonly NavigationItem[];

export const adminNavigation = [
  { label: "Overview", href: "/admin" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Classes", href: "/admin/classes" },
  { label: "Schedule", href: "/admin/schedule" },
  { label: "Trial Enquiries", href: "/admin/enquiries" },
  { label: "Workshops", href: "/admin/workshops" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Settings", href: "/admin/settings" },
] as const satisfies readonly NavigationItem[];

