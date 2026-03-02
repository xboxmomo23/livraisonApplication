"use client";

import { useEffect, useState, useCallback } from "react";
import {
  listAllTrips,
  listDrivers,
  listPatients,
  listAppointments,
  driverSetAvailability,
  getPatientById,
  getDriverById,
} from "@/lib/api";
import type { Trip, Driver, Patient, Appointment } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Car,
  Users,
  MapPin,
  AlertTriangle,
  Activity,
  Stethoscope,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [t, d, p, a] = await Promise.all([
      listAllTrips(),
      listDrivers(),
      listPatients(),
      listAppointments(),
    ]);
    setTrips(t);
    setDrivers(d);
    setPatients(p);
    setAppointments(a);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleToggleDriverAvailability(
    driverId: string,
    available: boolean
  ) {
    await driverSetAvailability(driverId, available);
    toast.success(
      `Driver ${available ? "set to available" : "set to offline"}`
    );
    await loadData();
  }

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
  const lateRiskTrips = trips.filter((t) => t.riskLate);
  const availableDrivers = drivers.filter((d) => d.available);

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor all trips, drivers, and patients
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {trips.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Trips</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <MapPin className="h-5 w-5 text-accent-foreground" />
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Car className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {availableDrivers.length}/{drivers.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Drivers Available
              </p>
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
                {lateRiskTrips.length}
              </p>
              <p className="text-xs text-muted-foreground">Late Risks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="trips" className="w-full">
        <TabsList>
          <TabsTrigger value="trips" className="gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Trips
          </TabsTrigger>
          <TabsTrigger value="drivers" className="gap-1.5">
            <Car className="h-3.5 w-3.5" />
            Drivers
          </TabsTrigger>
          <TabsTrigger value="patients" className="gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="appointments" className="gap-1.5">
            <Stethoscope className="h-3.5 w-3.5" />
            Appointments
          </TabsTrigger>
        </TabsList>

        {/* Trips Tab */}
        <TabsContent value="trips">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-primary" />
                All Trips
              </CardTitle>
              <CardDescription>
                Overview of all transport requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Risk</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trips.map((trip) => {
                      const patient = getPatientById(trip.patientId);
                      const driver = trip.assignedDriverId
                        ? getDriverById(trip.assignedDriverId)
                        : null;
                      return (
                        <TableRow key={trip.id}>
                          <TableCell className="font-mono text-xs">
                            {trip.id}
                          </TableCell>
                          <TableCell className="text-sm">
                            {patient?.fullName ?? "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {trip.requiredTransportType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={trip.status} />
                          </TableCell>
                          <TableCell className="text-sm">
                            {driver?.fullName ?? (
                              <span className="text-muted-foreground">
                                Unassigned
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {trip.etaMinutes > 0
                              ? `${trip.etaMinutes} min`
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {trip.riskLate && (
                              <Badge
                                variant="destructive"
                                className="gap-1 text-xs"
                              >
                                <AlertTriangle className="h-3 w-3" />
                                Late
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drivers Tab */}
        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Drivers</CardTitle>
              <CardDescription>
                Manage driver availability and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Car className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {driver.fullName}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {driver.transportType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {driver.distanceKmMock} km away
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {driver.capabilities.wheelchair && (
                          <Badge variant="outline" className="text-xs">
                            Wheelchair
                          </Badge>
                        )}
                        {driver.capabilities.stretcher && (
                          <Badge variant="outline" className="text-xs">
                            Stretcher
                          </Badge>
                        )}
                        {driver.capabilities.accompaniment && (
                          <Badge variant="outline" className="text-xs">
                            Accomp.
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={driver.available}
                          onCheckedChange={(checked) =>
                            handleToggleDriverAvailability(driver.id, checked)
                          }
                        />
                        <Badge
                          className={
                            driver.available
                              ? "bg-success text-success-foreground"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {driver.available ? "Online" : "Offline"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patients Tab */}
        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Patients</CardTitle>
              <CardDescription>All registered patients</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-mono text-xs">
                        {patient.id}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {patient.fullName}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appointments</CardTitle>
              <CardDescription>
                All scheduled medical appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((apt) => {
                      const patient = getPatientById(apt.patientId);
                      return (
                        <TableRow key={apt.id}>
                          <TableCell className="font-mono text-xs">
                            {apt.id}
                          </TableCell>
                          <TableCell className="text-sm">
                            {patient?.fullName ?? "-"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(
                              new Date(apt.dateTimeISO),
                              "MMM d, yyyy HH:mm"
                            )}
                          </TableCell>
                          <TableCell className="max-w-48 truncate text-sm">
                            {apt.address}
                          </TableCell>
                          <TableCell className="text-sm">
                            {apt.durationMin ?? 30} min
                          </TableCell>
                          <TableCell className="max-w-32 truncate text-sm text-muted-foreground">
                            {apt.notes ?? "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
