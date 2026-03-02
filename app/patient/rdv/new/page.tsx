"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createAppointment, createTrip } from "@/lib/api";
import type { TransportType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  CalendarPlus,
  Loader2,
  ArrowLeft,
  MapPin,
  Car,
} from "lucide-react";
import Link from "next/link";

const TRANSPORT_TYPES: { value: TransportType; label: string }[] = [
  { value: "TAXI", label: "Taxi" },
  { value: "VSL", label: "VSL (Light medical vehicle)" },
  { value: "AMBULANCE", label: "Ambulance" },
  { value: "PMR", label: "PMR (Reduced mobility)" },
];

export default function NewRdvPage() {
  const { user } = useAuth();
  const router = useRouter();
  const patientId = user?.patientIds?.[0] ?? "pat-1";

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  // Appointment fields
  const [dateTime, setDateTime] = useState("");
  const [address, setAddress] = useState("");
  const [duration, setDuration] = useState("30");
  const [notes, setNotes] = useState("");

  // Transport fields
  const [requestTransport, setRequestTransport] = useState(true);
  const [pickupAddress, setPickupAddress] = useState("");
  const [transportType, setTransportType] = useState<TransportType>("TAXI");
  const [wheelchair, setWheelchair] = useState(false);
  const [stretcher, setStretcher] = useState(false);
  const [accompaniment, setAccompaniment] = useState(false);

  // Created appointment
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  async function handleCreateAppointment(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const apt = await createAppointment({
        patientId,
        dateTimeISO: new Date(dateTime).toISOString(),
        address,
        durationMin: parseInt(duration, 10) || 30,
        notes: notes || undefined,
      });
      setAppointmentId(apt.id);
      toast.success("Appointment created!");
      if (requestTransport) {
        setStep(2);
      } else {
        router.push("/patient");
      }
    } catch {
      toast.error("Failed to create appointment.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestTransport(e: React.FormEvent) {
    e.preventDefault();
    if (!appointmentId) return;
    setLoading(true);
    try {
      const trip = await createTrip({
        appointmentId,
        patientId,
        pickupAddress,
        dropoffAddress: address,
        requiredTransportType: transportType,
        needs: { wheelchair, stretcher, accompaniment },
      });
      if (trip.assignedDriverId) {
        toast.success("Transport assigned! Driver is on the way.");
      } else {
        toast.info("Transport requested. Searching for available driver...");
      }
      router.push(`/patient/trip/${trip.id}`);
    } catch {
      toast.error("Failed to request transport.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center gap-3">
        <Link href="/patient">
          <Button variant="ghost" size="icon" aria-label="Back to dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {step === 1 ? "New Appointment" : "Request Transport"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {step === 1
              ? "Schedule a medical appointment"
              : "Book transport to your appointment"}
          </p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          1
        </div>
        <div
          className={`h-0.5 flex-1 rounded ${step === 2 ? "bg-primary" : "bg-border"}`}
        />
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          2
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarPlus className="h-4 w-4 text-primary" />
              Appointment Details
            </CardTitle>
            <CardDescription>
              Enter the details of your medical appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleCreateAppointment}
              className="flex flex-col gap-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="datetime">Date & Time</Label>
                  <Input
                    id="datetime"
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="10"
                    max="240"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Appointment Address</Label>
                <Input
                  id="address"
                  placeholder="e.g. 15 Rue de la Paix, 75002 Paris"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="e.g. Consultation cardiologie"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="request-transport"
                  checked={requestTransport}
                  onCheckedChange={(checked) =>
                    setRequestTransport(checked === true)
                  }
                />
                <Label
                  htmlFor="request-transport"
                  className="text-sm font-normal"
                >
                  I need medical transport
                </Label>
              </div>

              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {requestTransport
                  ? "Next: Transport Details"
                  : "Create Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Car className="h-4 w-4 text-primary" />
              Transport Request
            </CardTitle>
            <CardDescription>
              Configure your transport to the appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleRequestTransport}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="pickup">Pickup Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="pickup"
                    className="pl-9"
                    placeholder="e.g. 42 Boulevard Haussmann, Paris"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Drop-off Address</Label>
                <Input value={address} disabled className="bg-muted" />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Transport Type</Label>
                <Select
                  value={transportType}
                  onValueChange={(v) => setTransportType(v as TransportType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSPORT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-sm">Special Needs</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="wheelchair"
                      checked={wheelchair}
                      onCheckedChange={(c) => setWheelchair(c === true)}
                    />
                    <Label htmlFor="wheelchair" className="text-sm font-normal">
                      Wheelchair accessible
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="stretcher"
                      checked={stretcher}
                      onCheckedChange={(c) => setStretcher(c === true)}
                    />
                    <Label htmlFor="stretcher" className="text-sm font-normal">
                      Stretcher required
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="accompaniment"
                      checked={accompaniment}
                      onCheckedChange={(c) => setAccompaniment(c === true)}
                    />
                    <Label
                      htmlFor="accompaniment"
                      className="text-sm font-normal"
                    >
                      Accompaniment needed
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Request Transport
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
