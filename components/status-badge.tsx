"use client";

import { Badge } from "@/components/ui/badge";
import type { TripStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  TripStatus,
  { label: string; className: string }
> = {
  DEMANDE: {
    label: "Requested",
    className: "bg-muted text-muted-foreground",
  },
  ASSIGNE: {
    label: "Assigned",
    className: "bg-primary/10 text-primary",
  },
  ACCEPTE: {
    label: "Accepted",
    className: "bg-chart-2/15 text-accent-foreground",
  },
  EN_ROUTE: {
    label: "En Route",
    className: "bg-chart-4/15 text-chart-4",
  },
  ARRIVE: {
    label: "Arrived",
    className: "bg-success/15 text-success",
  },
  TERMINE: {
    label: "Completed",
    className: "bg-success/15 text-success",
  },
  ANNULE: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive",
  },
  REASSIGN: {
    label: "Reassigning",
    className: "bg-warning/15 text-warning-foreground",
  },
};

export function StatusBadge({ status }: { status: TripStatus }) {
  const config = STATUS_CONFIG[status];
  return <Badge className={config.className}>{config.label}</Badge>;
}
