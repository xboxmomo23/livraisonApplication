import type {
  User,
  Patient,
  Driver,
  Appointment,
  Trip,
  Message,
  TransportType,
  TripStatus,
  UserRole,
} from "./types";

// ─── Seed Data ───────────────────────────────────────────────

const patients: Patient[] = [
  { id: "pat-1", fullName: "Marie Dupont" },
  { id: "pat-2", fullName: "Jean Martin" },
];

const users: User[] = [
  {
    id: "usr-admin",
    fullName: "Admin Central",
    email: "admin@healdrive.fr",
    password: "admin",
    role: "ADMIN",
  },
  {
    id: "usr-aidant",
    fullName: "Sophie Dupont",
    email: "aidant@healdrive.fr",
    password: "aidant",
    role: "AIDANT",
    patientIds: ["pat-1", "pat-2"],
  },
  {
    id: "usr-patient",
    fullName: "Marie Dupont",
    email: "patient@healdrive.fr",
    password: "patient",
    role: "PATIENT",
    patientIds: ["pat-1"],
  },
  {
    id: "usr-driver1",
    fullName: "Pierre Leclerc",
    email: "driver1@healdrive.fr",
    password: "driver",
    role: "CHAUFFEUR",
  },
  {
    id: "usr-driver2",
    fullName: "Luc Bernard",
    email: "driver2@healdrive.fr",
    password: "driver",
    role: "CHAUFFEUR",
  },
  {
    id: "usr-driver3",
    fullName: "Emma Rousseau",
    email: "driver3@healdrive.fr",
    password: "driver",
    role: "CHAUFFEUR",
  },
];

const drivers: Driver[] = [
  {
    id: "drv-1",
    fullName: "Pierre Leclerc",
    transportType: "TAXI",
    available: true,
    capabilities: { wheelchair: false, stretcher: false, accompaniment: true },
    distanceKmMock: 4.2,
    etaMinMock: 12,
  },
  {
    id: "drv-2",
    fullName: "Luc Bernard",
    transportType: "VSL",
    available: true,
    capabilities: { wheelchair: true, stretcher: false, accompaniment: true },
    distanceKmMock: 7.8,
    etaMinMock: 20,
  },
  {
    id: "drv-3",
    fullName: "Emma Rousseau",
    transportType: "AMBULANCE",
    available: true,
    capabilities: { wheelchair: true, stretcher: true, accompaniment: true },
    distanceKmMock: 3.1,
    etaMinMock: 8,
  },
];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(10, 0, 0, 0);

const dayAfter = new Date();
dayAfter.setDate(dayAfter.getDate() + 2);
dayAfter.setHours(14, 30, 0, 0);

const appointments: Appointment[] = [
  {
    id: "apt-1",
    patientId: "pat-1",
    dateTimeISO: tomorrow.toISOString(),
    address: "15 Rue de la Paix, 75002 Paris",
    durationMin: 30,
    notes: "Consultation cardiologie",
  },
  {
    id: "apt-2",
    patientId: "pat-2",
    dateTimeISO: dayAfter.toISOString(),
    address: "8 Avenue Victor Hugo, 69003 Lyon",
    durationMin: 45,
    notes: "Scanner thoracique",
  },
];

const trips: Trip[] = [
  {
    id: "trip-1",
    appointmentId: "apt-1",
    patientId: "pat-1",
    pickupAddress: "42 Boulevard Haussmann, 75009 Paris",
    dropoffAddress: "15 Rue de la Paix, 75002 Paris",
    requiredTransportType: "TAXI",
    needs: { wheelchair: false, stretcher: false, accompaniment: false },
    status: "DEMANDE",
    etaMinutes: 0,
    distanceKm: 0,
  },
];

const messages: Message[] = [];

// ─── Helpers ─────────────────────────────────────────────────

let idCounter = 100;
function nextId(prefix: string): string {
  idCounter++;
  return `${prefix}-${idCounter}`;
}

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function smartMatch(
  requiredType: TransportType,
  needs: { wheelchair: boolean; stretcher: boolean; accompaniment: boolean }
): Driver | null {
  const compatible = drivers.filter((d) => {
    if (!d.available) return false;
    const typeMatch =
      d.transportType === requiredType ||
      (requiredType === "PMR" && d.capabilities.wheelchair);
    if (!typeMatch) return false;
    if (needs.wheelchair && !d.capabilities.wheelchair) return false;
    if (needs.stretcher && !d.capabilities.stretcher) return false;
    if (needs.accompaniment && !d.capabilities.accompaniment) return false;
    return true;
  });
  if (compatible.length === 0) return null;
  compatible.sort((a, b) => a.distanceKmMock - b.distanceKmMock);
  return compatible[0];
}

function computeRiskLate(trip: Trip): boolean {
  const apt = appointments.find((a) => a.id === trip.appointmentId);
  if (!apt) return false;
  const aptTime = new Date(apt.dateTimeISO).getTime();
  const now = Date.now();
  const arrivalEstimate = now + (trip.etaMinutes + 10) * 60 * 1000;
  return arrivalEstimate > aptTime;
}

// ─── API Functions ───────────────────────────────────────────

export async function authLogin(
  email: string,
  password: string
): Promise<User> {
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid credentials");
  const { password: _, ...safeUser } = user;
  const stored = { ...safeUser, role: user.role };
  if (typeof window !== "undefined") {
    localStorage.setItem("healdrive_user", JSON.stringify(stored));
  }
  return delay(user);
}

export function getCurrentUser(): (Omit<User, "password"> & { role: UserRole }) | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("healdrive_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("healdrive_user");
  }
}

export function switchRole(role: UserRole): void {
  const current = getCurrentUser();
  if (!current) return;
  const matchingUser = users.find((u) => u.role === role);
  if (!matchingUser) return;
  const { password: _, ...safeUser } = matchingUser;
  localStorage.setItem("healdrive_user", JSON.stringify(safeUser));
}

export async function listPatients(): Promise<Patient[]> {
  return delay([...patients]);
}

export async function listAppointments(
  patientId?: string
): Promise<Appointment[]> {
  const result = patientId
    ? appointments.filter((a) => a.patientId === patientId)
    : [...appointments];
  return delay(result);
}

export async function createAppointment(
  data: Omit<Appointment, "id">
): Promise<Appointment> {
  const apt: Appointment = { id: nextId("apt"), ...data };
  appointments.push(apt);
  return delay(apt);
}

export async function createTrip(request: {
  appointmentId: string;
  patientId: string;
  pickupAddress: string;
  dropoffAddress: string;
  requiredTransportType: TransportType;
  needs: { wheelchair: boolean; stretcher: boolean; accompaniment: boolean };
}): Promise<Trip> {
  const trip: Trip = {
    id: nextId("trip"),
    ...request,
    status: "DEMANDE",
    etaMinutes: 0,
    distanceKm: 0,
  };
  const driver = smartMatch(request.requiredTransportType, request.needs);
  if (driver) {
    trip.assignedDriverId = driver.id;
    trip.etaMinutes = driver.etaMinMock;
    trip.distanceKm = driver.distanceKmMock;
    trip.status = "ASSIGNE";
    trip.riskLate = computeRiskLate(trip);
  }
  trips.push(trip);
  return delay(trip);
}

export async function getTrip(id: string): Promise<Trip | null> {
  const trip = trips.find((t) => t.id === id) ?? null;
  if (trip) {
    trip.riskLate = computeRiskLate(trip);
  }
  return delay(trip);
}

export async function listTripsByPatient(patientId: string): Promise<Trip[]> {
  const result = trips.filter((t) => t.patientId === patientId);
  result.forEach((t) => {
    t.riskLate = computeRiskLate(t);
  });
  return delay(result);
}

export async function listAllTrips(): Promise<Trip[]> {
  trips.forEach((t) => {
    t.riskLate = computeRiskLate(t);
  });
  return delay([...trips]);
}

export async function listDrivers(): Promise<Driver[]> {
  return delay([...drivers]);
}

export async function driverSetAvailability(
  driverId: string,
  available: boolean
): Promise<Driver | null> {
  const driver = drivers.find((d) => d.id === driverId);
  if (!driver) return delay(null);
  driver.available = available;
  return delay({ ...driver });
}

export async function listNearbyRequestsForDriver(
  driverId: string
): Promise<Trip[]> {
  const driver = drivers.find((d) => d.id === driverId);
  if (!driver) return delay([]);
  const result = trips.filter(
    (t) =>
      (t.status === "DEMANDE" || t.status === "ASSIGNE") &&
      (t.assignedDriverId === driverId || t.status === "DEMANDE")
  );
  return delay(result);
}

export async function driverAcceptTrip(
  tripId: string,
  driverId: string
): Promise<Trip | null> {
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) return delay(null);
  trip.status = "ACCEPTE";
  trip.assignedDriverId = driverId;
  const driver = drivers.find((d) => d.id === driverId);
  if (driver) {
    trip.etaMinutes = driver.etaMinMock;
    trip.distanceKm = driver.distanceKmMock;
  }
  trip.riskLate = computeRiskLate(trip);
  return delay({ ...trip });
}

export async function updateTripStatus(
  tripId: string,
  status: TripStatus
): Promise<Trip | null> {
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) return delay(null);
  trip.status = status;
  trip.riskLate = computeRiskLate(trip);
  return delay({ ...trip });
}

export async function simulateDriverDelay(
  tripId: string,
  plusMinutes = 10
): Promise<Trip | null> {
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) return delay(null);
  trip.etaMinutes += plusMinutes;
  trip.riskLate = computeRiskLate(trip);
  return delay({ ...trip });
}

export async function simulateDriverCancel(
  tripId: string
): Promise<Trip | null> {
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) return delay(null);
  const oldDriverId = trip.assignedDriverId;
  trip.status = "ANNULE";
  trip.assignedDriverId = undefined;

  // Try reassignment
  const otherDrivers = drivers.filter((d) => d.id !== oldDriverId);
  const compatible = otherDrivers.filter((d) => {
    if (!d.available) return false;
    const typeMatch =
      d.transportType === trip.requiredTransportType ||
      (trip.requiredTransportType === "PMR" && d.capabilities.wheelchair);
    if (!typeMatch) return false;
    if (trip.needs.wheelchair && !d.capabilities.wheelchair) return false;
    if (trip.needs.stretcher && !d.capabilities.stretcher) return false;
    if (trip.needs.accompaniment && !d.capabilities.accompaniment) return false;
    return true;
  });

  if (compatible.length > 0) {
    compatible.sort((a, b) => a.distanceKmMock - b.distanceKmMock);
    const newDriver = compatible[0];
    trip.assignedDriverId = newDriver.id;
    trip.etaMinutes = newDriver.etaMinMock;
    trip.distanceKm = newDriver.distanceKmMock;
    trip.status = "ASSIGNE";
  }

  trip.riskLate = computeRiskLate(trip);
  return delay({ ...trip });
}

export async function listMessages(tripId: string): Promise<Message[]> {
  return delay(messages.filter((m) => m.tripId === tripId));
}

export async function sendMessage(
  tripId: string,
  senderRole: UserRole,
  senderName: string,
  content: string
): Promise<Message> {
  const msg: Message = {
    id: nextId("msg"),
    tripId,
    senderRole,
    senderName,
    content,
    createdAtISO: new Date().toISOString(),
  };
  messages.push(msg);
  return delay(msg);
}

export function getDriverById(driverId: string): Driver | undefined {
  return drivers.find((d) => d.id === driverId);
}

export function getAppointmentById(aptId: string): Appointment | undefined {
  return appointments.find((a) => a.id === aptId);
}

export function getPatientById(patientId: string): Patient | undefined {
  return patients.find((p) => p.id === patientId);
}
