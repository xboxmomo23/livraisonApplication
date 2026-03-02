"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { CalendarPlus, LayoutDashboard, Car, Shield } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

function getMobileItems(role: string): NavItem[] {
  if (role === "PATIENT" || role === "AIDANT") {
    return [
      {
        label: "Dashboard",
        href: "/patient",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        label: "New RDV",
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
    ];
  }
  return [
    {
      label: "Admin",
      href: "/admin",
      icon: <Shield className="h-5 w-5" />,
    },
  ];
}

export function MobileNav() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const items = getMobileItems(user.role);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur lg:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
