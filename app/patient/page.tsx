"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  listAppointments,
  listTripsByPatient,
  getDriverById,
} from "@/lib/api";
import type { Appointment, Trip } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CalendarPlus,
  Clock,
  MapPin,
  AlertTriangle,
  Car,
  ArrowRight,
  Stethoscope,
} from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/status-badge";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const patientId = user?.patientIds?.[0] ?? "pat-1";

  useEffect(() => {
    async function load() {
      const [apts, trps] = await Promise.all([
        listAppointments(patientId),
        listTripsByPatient(patientId),
      ]);
      setAppointments(apts);
      setTrips(trps);
      setLoading(false);
    }
    load();
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const activeTrips = trips.filter(
    (t) => t.status !== "TERMINE" && t.status !== "ANNULE"
  );
  const lateTrips = trips.filter((t) => t.riskLate);

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Patient Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your appointments and transport requests
          </p>
        </div>
        <Link href="/patient/rdv/new">
          <Button className="gap-2">
            <CalendarPlus className="h-4 w-4" />
            New Appointment
          </Button>
        </Link>
      </div>

      {lateTrips.length > 0 && (
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertTitle className="text-destructive">
            Risk of being late
          </AlertTitle>
          <AlertDescription className="text-destructive/80">
            {lateTrips.length} trip(s) may not arrive on time. Check details and
            consider requesting reassignment.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {appointments.length}
              </p>
              <p className="text-xs text-muted-foreground">Appointments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <Car className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {activeTrips.length}
              </p>
              <p className="text-xs text-muted-foreground">Active Trips</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {lateTrips.length}
              </p>
              <p className="text-xs text-muted-foreground">Late Risks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming Appointments</CardTitle>
          <CardDescription>Your scheduled medical appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No upcoming appointments.{" "}
              <Link
                href="/patient/rdv/new"
                className="text-primary hover:underline"
              >
                Create one
              </Link>
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-foreground">
                      {apt.notes || "Medical Appointment"}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {format(new Date(apt.dateTimeISO), "MMM d, yyyy HH:mm")}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {apt.address}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit text-xs">
                    {apt.durationMin ?? 30} min
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Trips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Trips</CardTitle>
          <CardDescription>
            Transport requests and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trips.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No trips yet. Request transport from a new appointment.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {trips.map((trip) => {
                const driver = trip.assignedDriverId
                  ? getDriverById(trip.assignedDriverId)
                  : null;
                return (
                  <Link
                    key={trip.id}
                    href={`/patient/trip/${trip.id}`}
                    className="group flex flex-col gap-2 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={trip.status} />
                        {trip.riskLate && (
                          <Badge
                            variant="destructive"
                            className="text-xs gap-1"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Late risk
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {trip.pickupAddress} → {trip.dropoffAddress}
                      </p>
                      {driver && (
                        <p className="text-xs text-muted-foreground">
                          Driver: {driver.fullName} ({trip.requiredTransportType}
                          ) - ETA {trip.etaMinutes} min
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
