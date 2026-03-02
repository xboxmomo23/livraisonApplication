"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  getTrip,
  getDriverById,
  getAppointmentById,
  listMessages,
  sendMessage,
  simulateDriverDelay,
  simulateDriverCancel,
  updateTripStatus,
} from "@/lib/api";
import type { Trip, Message, Driver, Appointment, TripStatus } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  MapPin,
  Navigation,
  Car,
  Send,
  User,
  RefreshCw,
  Timer,
  XCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const STATUS_TIMELINE: TripStatus[] = [
  "DEMANDE",
  "ASSIGNE",
  "ACCEPTE",
  "EN_ROUTE",
  "ARRIVE",
  "TERMINE",
];

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id as string;
  const { user } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [driver, setDriver] = useState<Driver | undefined>(undefined);
  const [appointment, setAppointment] = useState<Appointment | undefined>(
    undefined
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    const t = await getTrip(tripId);
    if (t) {
      setTrip(t);
      if (t.assignedDriverId) {
        setDriver(getDriverById(t.assignedDriverId));
      }
      setAppointment(getAppointmentById(t.appointmentId));
    }
    const msgs = await listMessages(tripId);
    setMessages(msgs);
    setLoading(false);
  }, [tripId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || !user) return;
    await sendMessage(tripId, user.role, user.fullName, chatInput.trim());
    setChatInput("");
    const msgs = await listMessages(tripId);
    setMessages(msgs);
  }

  async function handleSimulateDelay() {
    setActionLoading(true);
    const updated = await simulateDriverDelay(tripId, 10);
    if (updated) {
      setTrip(updated);
      toast.info("Driver delayed by 10 minutes.");
    }
    setActionLoading(false);
  }

  async function handleSimulateCancel() {
    setActionLoading(true);
    const updated = await simulateDriverCancel(tripId);
    if (updated) {
      setTrip(updated);
      if (updated.assignedDriverId) {
        setDriver(getDriverById(updated.assignedDriverId));
        toast.success("Driver cancelled. A new driver has been assigned!");
      } else {
        setDriver(undefined);
        toast.error("Driver cancelled. No compatible driver available.");
      }
    }
    setActionLoading(false);
  }

  async function handleAdvanceStatus() {
    if (!trip) return;
    const currentIdx = STATUS_TIMELINE.indexOf(trip.status);
    if (currentIdx < 0 || currentIdx >= STATUS_TIMELINE.length - 1) return;
    const nextStatus = STATUS_TIMELINE[currentIdx + 1];
    setActionLoading(true);
    const updated = await updateTripStatus(tripId, nextStatus);
    if (updated) {
      setTrip(updated);
      toast.success(`Status updated to ${nextStatus}`);
    }
    setActionLoading(false);
  }

  if (loading || !trip) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const currentTimelineIdx = STATUS_TIMELINE.indexOf(trip.status);

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/patient">
          <Button variant="ghost" size="icon" aria-label="Back to dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Trip Details
            </h1>
            <StatusBadge status={trip.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {trip.requiredTransportType} transport
          </p>
        </div>
      </div>

      {/* Late Warning */}
      {trip.riskLate && (
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertTitle className="text-destructive">
            Risk of being late!
          </AlertTitle>
          <AlertDescription className="flex flex-col gap-2 text-destructive/80">
            <span>
              Based on current ETA ({trip.etaMinutes} min), you may not arrive
              on time for your appointment.
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={() => {
                  toast.info("Opening chat with driver...");
                }}
              >
                Contact Driver
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={handleSimulateCancel}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="mr-1 h-3 w-3" />
                )}
                Request Reassignment
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trip Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trip Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Pickup
                </p>
                <p className="text-sm text-foreground">{trip.pickupAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20">
                <Navigation className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Drop-off
                </p>
                <p className="text-sm text-foreground">{trip.dropoffAddress}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">ETA</p>
                  <p className="text-sm font-semibold text-foreground">
                    {trip.etaMinutes} min
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="text-sm font-semibold text-foreground">
                    {trip.distanceKm} km
                  </p>
                </div>
              </div>
            </div>

            {driver && (
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Assigned Driver
                </p>
                <p className="text-sm font-medium text-foreground">
                  {driver.fullName}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-xs">
                    {driver.transportType}
                  </Badge>
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
                </div>
              </div>
            )}

            {appointment && (
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Appointment
                </p>
                <p className="text-sm text-foreground">
                  {appointment.notes || "Medical Appointment"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(
                    new Date(appointment.dateTimeISO),
                    "MMM d, yyyy HH:mm"
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Timeline</CardTitle>
            <CardDescription>Track the progress of your trip</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-0">
              {STATUS_TIMELINE.map((status, idx) => {
                const isDone = idx <= currentTimelineIdx;
                const isCurrent = idx === currentTimelineIdx;
                return (
                  <div key={status} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                          isCurrent
                            ? "border-primary bg-primary text-primary-foreground"
                            : isDone
                              ? "border-success bg-success text-success-foreground"
                              : "border-border bg-card text-muted-foreground"
                        }`}
                      >
                        {isDone && !isCurrent ? (
                          <CheckCircle className="h-3.5 w-3.5" />
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>
                      {idx < STATUS_TIMELINE.length - 1 && (
                        <div
                          className={`h-8 w-0.5 ${
                            isDone ? "bg-success" : "bg-border"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-6">
                      <p
                        className={`text-sm font-medium ${
                          isCurrent
                            ? "text-primary"
                            : isDone
                              ? "text-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        <StatusBadge status={status} />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simulation controls */}
            <div className="mt-4 flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Simulation Controls
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAdvanceStatus}
                  disabled={
                    actionLoading ||
                    trip.status === "TERMINE" ||
                    trip.status === "ANNULE"
                  }
                  className="gap-1.5 text-xs"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Advance Status
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSimulateDelay}
                  disabled={actionLoading}
                  className="gap-1.5 text-xs"
                >
                  <Timer className="h-3.5 w-3.5" />
                  Delay +10 min
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSimulateCancel}
                  disabled={actionLoading}
                  className="gap-1.5 text-xs text-destructive hover:text-destructive"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Cancel Driver
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Messages</CardTitle>
          <CardDescription>
            Communicate with your driver or support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-3">
            {messages.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No messages yet. Send one to start a conversation.
              </p>
            )}
            {messages.map((msg) => {
              const isOwnMessage = msg.senderRole === user?.role;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isOwnMessage ? "flex-row-reverse" : ""}`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isOwnMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-xs font-medium opacity-75">
                      {msg.senderName}
                    </p>
                    <p className="text-sm">{msg.content}</p>
                    <p className="mt-1 text-xs opacity-50">
                      {format(new Date(msg.createdAtISO), "HH:mm")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!chatInput.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
