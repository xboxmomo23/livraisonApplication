export type UserRole = "PATIENT" | "AIDANT" | "CHAUFFEUR" | "ADMIN";

export type TransportType = "TAXI" | "VSL" | "AMBULANCE" | "PMR";

export type TripStatus =
  | "DEMANDE"
  | "ASSIGNE"
  | "ACCEPTE"
  | "EN_ROUTE"
  | "ARRIVE"
  | "TERMINE"
  | "ANNULE"
  | "REASSIGN";

export interface Patient {
  id: string;
  fullName: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  patientIds?: string[];
}

export interface Driver {
  id: string;
  fullName: string;
  transportType: TransportType;
  available: boolean;
  capabilities: {
    wheelchair: boolean;
    stretcher: boolean;
    accompaniment: boolean;
  };
  distanceKmMock: number;
  etaMinMock: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  dateTimeISO: string;
  address: string;
  durationMin?: number;
  notes?: string;
}

export interface Trip {
  id: string;
  appointmentId: string;
  patientId: string;
  pickupAddress: string;
  dropoffAddress: string;
  requiredTransportType: TransportType;
  needs: {
    wheelchair: boolean;
    stretcher: boolean;
    accompaniment: boolean;
  };
  status: TripStatus;
  etaMinutes: number;
  distanceKm: number;
  assignedDriverId?: string;
  riskLate?: boolean;
}

export interface Message {
  id: string;
  tripId: string;
  senderRole: UserRole;
  senderName: string;
  content: string;
  createdAtISO: string;
}
