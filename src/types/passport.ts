export type UserRole = "OWNER" | "TECHNICIAN" | "VIEWER" | "ADMIN";
export type DeviceInternalStatus = 'PENDING_INSPECTION' | 'REFURBISHED' | 'RECYCLED';
export type DevicePayoutStatus = 'PENDING_INSPECTION' | 'PAYMENT_INITIATED' | 'PAID';
export type AccountStatus = "ACTIVE" | "PENDING" | "REJECTED";
export type DeviceType = "SMARTPHONE" | "LAPTOP";
export type DeviceStatus =
  | "REGISTERED"
  | "IN_USE"
  | "UNDER_REPAIR"
  | "FOR_SALE"
  | "REFURBISHING"
  | "RECYCLED";
export type ComponentType =
  | "BATTERY"
  | "RAM"
  | "SSD"
  | "DISPLAY"
  | "MOTHERBOARD"
  | "CAMERA"
  | "PORT"
  | "OTHER";
export type ComponentCondition = "GOOD" | "FAIR" | "POOR";
export type ComponentOrigin = "ORIGINAL" | "REPLACED";
export type Grade = "A" | "B" | "C" | "D";
export type Recommendation = "REUSE" | "REPAIR" | "REFURBISH" | "RECYCLE";

export interface PassportUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: AccountStatus;
}

export interface DeviceComponent {
  id: string;
  type: ComponentType;
  origin: ComponentOrigin;
  condition: ComponentCondition;
  batteryHealth: number | null;
  active: boolean;
  installedAt: string;
  details?: string;
}

export interface RepairAmendment {
  id: string;
  note: string;
  createdAt: string;
  authorName: string;
}

export interface RepairRecord {
  id: string;
  date: string;
  description: string;
  technicianId: string | null;
  technicianName: string;
  verified: boolean;
  cost: number;
  affectedComponentIds: string[];
  notes: string;
  amendments: RepairAmendment[];
}

export interface AuditEntry {
  id: string;
  date: string;
  actor: string;
  action: string;
}

export interface DevicePassport {
  id: string;
  passportId: string;
  name: string;
  deviceType: DeviceType;
  brand: string;
  model: string;
  serial: string;
  purchaseDate: string;
  os: string;
  ramGb: number | null;
  storageGb: number | null;
  processor: string;
  previousOwnersCount?: number;
  knownDamages?: string[];
  damageNotes?: string;
  priorHistory?: string;
  status: DeviceStatus;
  internalStatus: DeviceInternalStatus;
  payoutStatus: DevicePayoutStatus;
  payoutAmount: number | null;
  ownerPhotos: string[];
  listingPhotos: string[];
  activeDamages: string[];
  resolvedDamages: string[];
  isListedForSale: boolean;
  listingPrice: number | null;
  listingCondition: string | null;
  listingNotes: string | null;
  ownerId: string;
  qrToken: string;
  components: DeviceComponent[];
  repairs: RepairRecord[];
  audit: AuditEntry[];
  createdAt: string;
  updatedAt?: string;
}

export interface AppState {
  users: PassportUser[];
  devices: DevicePassport[];
  currentUserId: string | null;
}

export interface AssessmentDeductions {
  age: number;
  repairs: number;
  battery: number;
  components: number;
  critical: number;
  damages: number;
  previousOwners: number;
}

export interface DeviceAssessment {
  score: number;
  grade: Grade;
  recommendation: Recommendation;
  fullYearsSincePurchase: number;
  deductions: AssessmentDeductions;
  reasons: string[];
  countPoorComponents: number;
  criticalFailures: number;
}

export interface DeviceInput {
  deviceType: DeviceType;
  brand: string;
  model: string;
  serial: string;
  purchaseDate: string;
  os: string;
  ramGb: number | null;
  storageGb: number | null;
  processor: string;
  previousOwnersCount?: number;
  knownDamages?: string[];
  damageNotes?: string;
  priorHistory?: string;
  ownerPhotos?: string[];
}

export interface ComponentInput {
  type: ComponentType;
  origin: ComponentOrigin;
  condition: ComponentCondition;
  batteryHealth: number | null;
  details: string;
}

export interface RepairInput {
  date: string;
  description: string;
  cost: number;
  affectedComponentIds: string[];
  notes: string;
  verified: boolean;
}

export interface ListingInput {
  price: number;
  condition: string;
  notes: string;
  listingPhotos?: string[];
}
