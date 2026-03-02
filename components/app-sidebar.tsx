"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  CalendarPlus,
  LayoutDashboard,
  Car,
  Shield,
  MapPin,
  Users,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

function getNavItems(role: string): NavItem[] {
  if (role === "PATIENT" || role === "AIDANT") {
    return [
      {
        label: "Dashboard",
        href: "/patient",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        label: "New Appointment",
        href: "/patient/rdv/new",
        icon: <CalendarPlus className="h-5 w-5" />,
      },
    ];
  }
  if (role === "CHAUFFEUR") {
    return [
      {
        label: "Dashboard",
        href: "/driver",
        icon: <Car className="h-5 w-5" />,
      },
      {
        label: "Nearby Requests",
        href: "/driver",
        icon: <MapPin className="h-5 w-5" />,
      },
    ];
  }
  return [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      label: "Drivers",
      href: "/admin",
      icon: <Users className="h-5 w-5" />,
    },
  ];
}

export function AppSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const items = getNavItems(user.role);

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card lg:block">
      <nav className="flex flex-col gap-1 p-3">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
