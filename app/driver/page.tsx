"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  listNearbyRequestsForDriver,
  driverAcceptTrip,
  driverSetAvailability,
  updateTripStatus,
  listDrivers,
  getPatientById,
  getAppointmentById,
} from "@/lib/api";
import type { Trip, Driver, TripStatus } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Car,
  MapPin,
  Navigation,
  Clock,
  CheckCircle,
  Loader2,
  AlertTriangle,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const STATUS_TIMELINE: TripStatus[] = [
  "ACCEPTE",
  "EN_ROUTE",
  "ARRIVE",
  "TERMINE",
];

export default function DriverDashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [driverInfo, setDriverInfo] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Match user to driver (in the mock, driver IDs map to specific users)
  const driverId =
    user?.email === "driver1@healdrive.fr"
      ? "drv-1"
      : user?.email === "driver2@healdrive.fr"
        ? "drv-2"
        : "drv-3";

  const loadData = useCallback(async () => {
    const [requests, allDrivers] = await Promise.all([
      listNearbyRequestsForDriver(driverId),
      listDrivers(),
    ]);
    setTrips(requests);
    setDriverInfo(allDrivers.find((d) => d.id === driverId) ?? null);
    setLoading(false);
  }, [driverId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleToggleAvailability(available: boolean) {
    await driverSetAvailability(driverId, available);
    setDriverInfo((prev) => (prev ? { ...prev, available } : null));
    toast.success(available ? "You are now available" : "You are now offline");
  }

  async function handleAcceptTrip(tripId: string) {
    setActionLoading(tripId);
    const updated = await driverAcceptTrip(tripId, driverId);
    if (updated) {
      toast.success("Trip accepted!");
      await loadData();
    }
    setActionLoading(null);
  }

  async function handleAdvanceStatus(tripId: string, currentStatus: TripStatus) {
    const currentIdx = STATUS_TIMELINE.indexOf(currentStatus);
    if (currentIdx < 0 || currentIdx >= STATUS_TIMELINE.length - 1) return;
    const nextStatus = STATUS_TIMELINE[currentIdx + 1];
    setActionLoading(tripId);
    await updateTripStatus(tripId, nextStatus);
    toast.success(`Status updated to ${nextStatus}`);
    await loadData();
    setActionLoading(null);
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const assignedTrips = trips.filter((t) => t.assignedDriverId === driverId);
  const pendingTrips = trips.filter(
    (t) => t.status === "DEMANDE" && t.assignedDriverId !== driverId
  );

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Driver Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your trips and availability
          </p>
        </div>
        {driverInfo && (
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Label htmlFor="availability" className="text-sm font-medium">
              Available
            </Label>
            <Switch
              id="availability"
              checked={driverInfo.available}
              onCheckedChange={handleToggleAvailability}
            />
            <Badge
              className={
                driverInfo.available
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              }
            >
              {driverInfo.available ? "Online" : "Offline"}
            </Badge>
          </div>
        )}
      </div>

      {/* Driver Info */}
      {driverInfo && (
        <Card>
          <CardContent className="flex flex-wrap items-center gap-6 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {driverInfo.fullName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {driverInfo.transportType}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {driverInfo.capabilities.wheelchair && (
                <Badge variant="outline">Wheelchair</Badge>
              )}
              {driverInfo.capabilities.stretcher && (
                <Badge variant="outline">Stretcher</Badge>
              )}
              {driverInfo.capabilities.accompaniment && (
                <Badge variant="outline">Accompaniment</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assigned Trips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Active Trips</CardTitle>
          <CardDescription>
            Trips assigned to you that need your attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignedTrips.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No active trips assigned to you.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {assignedTrips.map((trip) => {
                const patient = getPatientById(trip.patientId);
                const apt = getAppointmentById(trip.appointmentId);
                return (
                  <div
                    key={trip.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <StatusBadge status={trip.status} />
                      <Badge variant="secondary" className="text-xs">
                        {trip.requiredTransportType}
                      </Badge>
                      {trip.riskLate && (
                        <Badge
                          variant="destructive"
                          className="gap-1 text-xs"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          Late Risk
                        </Badge>
                      )}
                    </div>

                    <div className="mb-3 flex flex-col gap-2">
                      {patient && (
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {patient.fullName}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {trip.pickupAddress}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Navigation className="h-3.5 w-3.5" />
                        {trip.dropoffAddress}
                      </div>
                      {apt && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          Appointment at{" "}
                          {format(
                            new Date(apt.dateTimeISO),
                            "HH:mm, MMM d"
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {trip.status === "ASSIGNE" && (
                        <Button
                          size="sm"
                          onClick={() => handleAcceptTrip(trip.id)}
                          disabled={actionLoading === trip.id}
                          className="gap-1.5"
                        >
                          {actionLoading === trip.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3.5 w-3.5" />
                          )}
                          Accept Trip
                        </Button>
                      )}
                      {STATUS_TIMELINE.includes(trip.status) &&
                        trip.status !== "TERMINE" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleAdvanceStatus(trip.id, trip.status)
                            }
                            disabled={actionLoading === trip.id}
                            className="gap-1.5"
                          >
                            Advance Status
                          </Button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingTrips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nearby Requests</CardTitle>
            <CardDescription>
              Unassigned transport requests in your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {pendingTrips.map((trip) => {
                const patient = getPatientById(trip.patientId);
                return (
                  <div
                    key={trip.id}
                    className="flex flex-col gap-2 rounded-lg border border-dashed border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {trip.requiredTransportType}
                        </Badge>
                        {patient && (
                          <span className="text-sm text-foreground">
                            {patient.fullName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {trip.pickupAddress} → {trip.dropoffAddress}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAcceptTrip(trip.id)}
                      disabled={actionLoading === trip.id}
                    >
                      {actionLoading === trip.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Accept"
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
