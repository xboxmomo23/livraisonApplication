"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  LogOut,
  ChevronDown,
  User,
  Shield,
  Car,
  Users,
} from "lucide-react";
import type { UserRole } from "@/lib/types";

const ROLE_LABELS: Record<UserRole, string> = {
  PATIENT: "Patient",
  AIDANT: "Aidant",
  CHAUFFEUR: "Chauffeur",
  ADMIN: "Admin",
};

const ROLE_COLORS: Record<UserRole, string> = {
  PATIENT: "bg-primary text-primary-foreground",
  AIDANT: "bg-accent text-accent-foreground",
  CHAUFFEUR: "bg-chart-3 text-card",
  ADMIN: "bg-foreground text-background",
};

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  PATIENT: <User className="h-4 w-4" />,
  AIDANT: <Users className="h-4 w-4" />,
  CHAUFFEUR: <Car className="h-4 w-4" />,
  ADMIN: <Shield className="h-4 w-4" />,
};

const ALL_ROLES: UserRole[] = ["PATIENT", "AIDANT", "CHAUFFEUR", "ADMIN"];

export function Navbar() {
  const { user, logout, switchRole } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function handleSwitchRole(role: UserRole) {
    switchRole(role);
    if (role === "PATIENT" || role === "AIDANT") {
      router.push("/patient");
    } else if (role === "CHAUFFEUR") {
      router.push("/driver");
    } else {
      router.push("/admin");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            HealDrive
          </span>
        </Link>

        <div className="flex-1" />

        {user && (
          <div className="flex items-center gap-3">
            <Badge
              className={`${ROLE_COLORS[user.role]} hidden gap-1.5 sm:flex`}
            >
              {ROLE_ICONS[user.role]}
              {ROLE_LABELS[user.role]}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  Switch Role
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Demo Role Switcher</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALL_ROLES.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => handleSwitchRole(role)}
                    className="gap-2"
                  >
                    {ROLE_ICONS[role]}
                    {ROLE_LABELS[role]}
                    {user.role === role && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Active
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="hidden text-sm text-muted-foreground lg:inline">
              {user.fullName}
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
