import type {
  AccountStatus,
  AppState,
  ComponentInput,
  DeviceInput,
  DevicePassport,
  DeviceStatus,
  PassportUser,
  RepairInput,
  UserRole,
} from "@/types/passport";
import { calculateAssessment } from "@/utils/scoringEngine";

const STORAGE_KEY = "retech-passport-demo-v1";
const nowIso = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

function secureToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

function component(
  id: string,
  type: DevicePassport["components"][number]["type"],
  origin: DevicePassport["components"][number]["origin"],
  condition: DevicePassport["components"][number]["condition"],
  batteryHealth: number | null = null,
  active = true,
  details = "",
) {
  return { id, type, origin, condition, batteryHealth, active, installedAt: nowIso(), details };
}

function repair(
  id: string,
  date: string,
  description: string,
  technicianName: string,
  cost: number,
  affectedComponentIds: string[],
  verified = true,
) {
  return {
    id,
    date,
    description,
    technicianId: verified ? "user-tech" : null,
    technicianName,
    verified,
    cost,
    affectedComponentIds,
    notes: "",
    amendments: [],
  };
}

export function createDemoState(): AppState {
  const users: PassportUser[] = [
    { id: "user-owner", email: "owner@example.org", name: "Aarav Singh", role: "OWNER", status: "ACTIVE" },
    { id: "user-tech", email: "tech@example.org", name: "Pratham Gupta", role: "TECHNICIAN", status: "ACTIVE" },
    { id: "user-pending", email: "pendingtech@example.org", name: "Ravi Verma", role: "TECHNICIAN", status: "PENDING" },
    { id: "user-viewer", email: "viewer@example.org", name: "Buyer / Recycler", role: "VIEWER", status: "ACTIVE" },
    { id: "user-admin", email: "admin@example.org", name: "System Admin", role: "ADMIN", status: "ACTIVE" },
  ];
  const devices: DevicePassport[] = [
    {
      id: "device-123",
      passportId: "RTP-2026-000123",
      name: "ExampleBook 14",
      deviceType: "LAPTOP",
      brand: "ExampleBrand",
      model: "ExampleBook 14",
      serial: "SN1234567890",
      purchaseDate: "2022-08-15",
      os: "Windows 11",
      ramGb: 8,
      storageGb: 512,
      processor: "Intel Core i5",
      status: "IN_USE",
      ownerId: "user-owner",
      qrToken: "Xk3u9QmZc0Wb5T1hYpL2aA",
      components: [
        component("c-battery-123", "BATTERY", "REPLACED", "POOR", 62, true, "62% health · replaced 2025"),
        component("c-display-123", "DISPLAY", "REPLACED", "GOOD", null, true, "Replaced 2024"),
        component("c-keyboard-123", "OTHER", "ORIGINAL", "FAIR", null, true, "Keyboard"),
        component("c-ram-123", "RAM", "ORIGINAL", "GOOD", null, true, "8 GB"),
        component("c-ssd-123", "SSD", "ORIGINAL", "GOOD", null, true, "512 GB SSD"),
      ],
      repairs: [
        repair("repair-123-1", "2024-03-14", "Display replaced", "Pratham Gupta", 4500, ["c-display-123"]),
        repair("repair-123-2", "2025-06-02", "Battery replaced", "Pratham Gupta", 3200, ["c-battery-123"]),
      ],
      audit: [
        { id: "audit-123-1", date: "2024-03-14T09:20:00.000Z", actor: "Pratham Gupta", action: "Display replaced and verified" },
        { id: "audit-123-2", date: "2025-06-02T11:10:00.000Z", actor: "Pratham Gupta", action: "Battery replaced and verified" },
      ],
      createdAt: "2022-08-15T09:00:00.000Z",
    },
    {
      id: "device-118", passportId: "RTP-2026-000118", name: "ExamplePhone X", deviceType: "SMARTPHONE",
      brand: "ExampleBrand", model: "ExamplePhone X", serial: "IMEI000000000118", purchaseDate: "2025-09-01", os: "Android 15",
      ramGb: 8, storageGb: 256, processor: "Example A18", status: "IN_USE", ownerId: "user-owner", qrToken: "pH8mR2vQ6sL1tK9cZ4wN3g",
      components: [component("c-battery-118", "BATTERY", "ORIGINAL", "GOOD", 94), component("c-display-118", "DISPLAY", "ORIGINAL", "GOOD"), component("c-camera-118", "CAMERA", "ORIGINAL", "GOOD"), component("c-ram-118", "RAM", "ORIGINAL", "GOOD", null, true, "8 GB"), component("c-ssd-118", "SSD", "ORIGINAL", "GOOD", null, true, "256 GB")],
      repairs: [], audit: [], createdAt: "2025-09-01T09:00:00.000Z",
    },
    {
      id: "device-097", passportId: "RTP-2026-000097", name: "ExampleBook Pro", deviceType: "LAPTOP",
      brand: "ExampleBrand", model: "ExampleBook Pro", serial: "SN1234560097", purchaseDate: "2019-02-10", os: "Windows 10",
      ramGb: 16, storageGb: 512, processor: "Intel Core i7", status: "UNDER_REPAIR", ownerId: "user-owner", qrToken: "vL4qS8nM2wJ6cR1pX9kT5a",
      components: [component("c-battery-097", "BATTERY", "REPLACED", "POOR", 40), component("c-display-097", "DISPLAY", "REPLACED", "POOR"), component("c-board-097", "MOTHERBOARD", "REPLACED", "POOR"), component("c-ssd-097", "SSD", "ORIGINAL", "FAIR")],
      repairs: Array.from({ length: 5 }, (_, index) => repair(`repair-097-${index + 1}`, `202${index}-04-10`, `Service visit ${index + 1}`, "Pratham Gupta", 1800 + index * 250, [], true)),
      audit: [], createdAt: "2019-02-10T09:00:00.000Z",
    },
    {
      id: "device-090", passportId: "RTP-2026-000090", name: "ExamplePhone Lite", deviceType: "SMARTPHONE",
      brand: "ExampleBrand", model: "ExamplePhone Lite", serial: "IMEI000000000090", purchaseDate: "2023-04-03", os: "Android 14",
      ramGb: 6, storageGb: 128, processor: "Example A12", status: "FOR_SALE", ownerId: "user-owner", qrToken: "mB6kP3xR8zF1vW9dY2aN4q",
      components: [component("c-battery-090", "BATTERY", "ORIGINAL", "FAIR", 72), component("c-display-090", "DISPLAY", "ORIGINAL", "GOOD"), component("c-camera-090", "CAMERA", "ORIGINAL", "GOOD")],
      repairs: [repair("repair-090-1", "2024-01-12", "Charging port cleaned", "Owner reported", 0, [], false)],
      audit: [], createdAt: "2023-04-03T09:00:00.000Z",
    },
    {
      id: "device-071", passportId: "RTP-2026-000071", name: "ExamplePhone Z", deviceType: "SMARTPHONE",
      brand: "ExampleBrand", model: "ExamplePhone Z", serial: "IMEI000000000071", purchaseDate: "2021-05-18", os: "Android 13",
      ramGb: 8, storageGb: 128, processor: "Example A10", status: "REFURBISHING", ownerId: "user-owner", qrToken: "qC7nH2wL5xM8rV1pB4zK9a",
      components: [component("c-battery-071", "BATTERY", "ORIGINAL", "FAIR", 58), component("c-display-071", "DISPLAY", "ORIGINAL", "FAIR"), component("c-camera-071", "CAMERA", "ORIGINAL", "FAIR"), component("c-port-071", "PORT", "ORIGINAL", "GOOD")],
      repairs: [repair("repair-071-1", "2022-02-04", "Screen inspection", "Owner reported", 0, [], false), repair("repair-071-2", "2023-07-14", "Battery check", "Owner reported", 0, [], false), repair("repair-071-3", "2024-10-01", "Camera service", "Owner reported", 0, [], false)],
      audit: [], createdAt: "2021-05-18T09:00:00.000Z",
    },
  ];
  return { users, devices, currentUserId: "user-owner" };
}

export interface Mutation<T> {
  state: AppState;
  value: T;
}

function commit<T>(state: AppState, value: T, next: Partial<AppState>): Mutation<T> {
  return { state: { ...state, ...next }, value };
}

function withDevice(state: AppState, device: DevicePassport) {
  return { ...state, devices: state.devices.map((item) => (item.id === device.id ? device : item)) };
}

function addAudit(device: DevicePassport, actor: string, action: string): DevicePassport {
  return {
    ...device,
    audit: [{ id: uid("audit"), date: nowIso(), actor, action }, ...device.audit],
  };
}

function currentUser(state: AppState) {
  return state.users.find((user) => user.id === state.currentUserId) ?? null;
}

const roleEmails: Record<UserRole, string> = {
  OWNER: "owner@example.org",
  TECHNICIAN: "tech@example.org",
  VIEWER: "viewer@example.org",
  ADMIN: "admin@example.org",
};

export const api = {
  loadState(): AppState {
    if (typeof window === "undefined") return createDemoState();
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as AppState;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    return createDemoState();
  },
  saveState(state: AppState) {
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  demoLogin(state: AppState, role: UserRole) {
    // TODO: Antigravity - replace with REST call to POST /api/auth/login
    const user = state.users.find((candidate) => candidate.email === roleEmails[role]);
    if (!user) throw new Error("Demo account is unavailable.");
    return commit(state, user, { currentUserId: user.id });
  },
  login(state: AppState, email: string, password: string) {
    // TODO: Antigravity - replace with REST call to POST /api/auth/login
    if (!password.trim()) throw new Error("Enter your password.");
    const user = state.users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error("No demo account matches that email. Try a demo login.");
    if (user.status === "PENDING") throw new Error("Your technician account is waiting for Admin approval.");
    if (user.status === "REJECTED") throw new Error("This account is not approved for access.");
    return commit(state, user, { currentUserId: user.id });
  },
  signup(state: AppState, name: string, email: string, role: UserRole) {
    // TODO: Antigravity - replace with REST call to POST /api/auth/register
    if (state.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }
    const user: PassportUser = {
      id: uid("user"),
      name,
      email,
      role,
      status: role === "TECHNICIAN" ? "PENDING" : "ACTIVE",
    };
    const next = { ...state, users: [...state.users, user], currentUserId: user.id };
    return { state: next, value: user };
  },
  logout(state: AppState) {
    return commit(state, null, { currentUserId: null });
  },
  listDevices(state: AppState, userId: string | null) {
    // TODO: Antigravity - replace with REST call to GET /api/devices
    const user = state.users.find((candidate) => candidate.id === userId);
    if (user?.role === "OWNER") return state.devices.filter((device) => device.ownerId === user.id);
    return state.devices;
  },
  getDevice(state: AppState, id: string) {
    // TODO: Antigravity - replace with REST call to GET /api/devices/{id}
    return state.devices.find((device) => device.id === id) ?? null;
  },
  registerDevice(state: AppState, input: DeviceInput) {
    // TODO: Antigravity - replace with REST call to POST /api/devices
    const duplicate = state.devices.some((device) => device.serial.trim().toLowerCase() === input.serial.trim().toLowerCase());
    if (duplicate) throw new Error("409 · A device with this serial number or IMEI is already registered.");
    const user = currentUser(state);
    if (!user || (user.role !== "OWNER" && user.role !== "TECHNICIAN")) throw new Error("Only owners and approved technicians can register devices.");
    if (user.role === "TECHNICIAN" && user.status !== "ACTIVE") throw new Error("Technician approval is required before registering a device.");
    const passportNumber = Math.max(123, ...state.devices.map((device) => Number(device.passportId.slice(-6)))) + 1;
    const id = uid("device");
    const newDevice: DevicePassport = {
      id,
      passportId: `RTP-2026-${String(passportNumber).padStart(6, "0")}`,
      name: `${input.brand.trim()} ${input.model.trim()}`.trim(),
      ...input,
      status: "REGISTERED",
      ownerId: user.id,
      qrToken: secureToken(),
      components: [
        { ...component(uid("component"), "BATTERY", "ORIGINAL", "GOOD", null), installedAt: nowIso() },
      ],
      repairs: [],
      audit: [{ id: uid("audit"), date: nowIso(), actor: user.name, action: "Device passport created" }],
      createdAt: nowIso(),
    };
    return { state: { ...state, devices: [newDevice, ...state.devices] }, value: newDevice };
  },
  updateDevice(state: AppState, id: string, changes: Partial<Pick<DevicePassport, "status" | "os" | "ramGb" | "storageGb" | "processor" | "model" | "name">>) {
    // TODO: Antigravity - replace with REST call to PUT /api/devices/{id}
    const device = api.getDevice(state, id);
    if (!device) throw new Error("Device passport not found.");
    if (device.status === "RECYCLED") throw new Error("A recycled device passport is read-only.");
    const updated = addAudit({ ...device, ...changes }, currentUser(state)?.name ?? "User", "Passport details updated");
    return { state: withDevice(state, updated), value: updated };
  },
  transferDevice(state: AppState, id: string, email: string) {
    // TODO: Antigravity - replace with REST call to POST /api/devices/{id}/transfer
    const device = api.getDevice(state, id);
    if (!device) throw new Error("Device passport not found.");
    if (device.ownerId !== state.currentUserId) throw new Error("Only the owner can transfer this device.");
    const recipient = state.users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.status === "ACTIVE");
    if (!recipient) throw new Error("No active account matches that email.");
    const updated = addAudit({ ...device, ownerId: recipient.id, qrToken: secureToken() }, currentUser(state)?.name ?? "Owner", `Ownership transferred to ${recipient.name}; QR token regenerated`);
    return { state: withDevice(state, updated), value: updated };
  },
  getQr(state: AppState, id: string) {
    // TODO: Antigravity - replace with REST call to GET /api/devices/{id}/qr
    return api.getDevice(state, id)?.qrToken ?? null;
  },
  getPublicPassport(state: AppState, token: string) {
    // TODO: Antigravity - replace with REST call to GET /api/passport/public/{token}
    return state.devices.find((device) => device.qrToken === token) ?? null;
  },
  addComponent(state: AppState, id: string, input: ComponentInput) {
    // TODO: Antigravity - replace with REST call to POST /api/devices/{id}/components
    const device = api.getDevice(state, id);
    if (!device) throw new Error("Device passport not found.");
    if (input.batteryHealth !== null && (input.batteryHealth < 0 || input.batteryHealth > 100)) throw new Error("Battery health must be between 0 and 100.");
    const components = device.components.map((existing) => existing.type === input.type && existing.active ? { ...existing, active: false } : existing);
    const added = { ...component(uid("component"), input.type, input.origin, input.condition, input.batteryHealth, true, input.details), installedAt: nowIso() };
    const updated = addAudit({ ...device, components: [...components, added] }, currentUser(state)?.name ?? "User", `${input.type} component added`);
    return { state: withDevice(state, updated), value: updated };
  },
  updateComponent(state: AppState, deviceId: string, componentId: string, input: ComponentInput) {
    // TODO: Antigravity - replace with REST call to PUT /api/components/{id}
    const device = api.getDevice(state, deviceId);
    if (!device) throw new Error("Device passport not found.");
    const updated = addAudit({ ...device, components: device.components.map((item) => item.id === componentId ? { ...item, ...input } : item) }, currentUser(state)?.name ?? "User", "Component details updated");
    return { state: withDevice(state, updated), value: updated };
  },
  listRepairs(state: AppState, deviceId: string) {
    // TODO: Antigravity - replace with REST call to GET /api/devices/{id}/repairs
    return api.getDevice(state, deviceId)?.repairs ?? [];
  },
  addRepair(state: AppState, deviceId: string, input: RepairInput) {
    // TODO: Antigravity - replace with REST call to POST /api/devices/{id}/repairs
    const device = api.getDevice(state, deviceId);
    if (!device) throw new Error("Device passport not found.");
    const user = currentUser(state);
    const verified = input.verified && user?.role === "TECHNICIAN" && user.status === "ACTIVE";
    const record = {
      id: uid("repair"),
      ...input,
      technicianId: verified && user ? user.id : null,
      technicianName: verified && user ? user.name : user?.name ?? "Owner reported",
      verified,
      amendments: [],
    };
    const affected = new Set(input.affectedComponentIds);
    const components = device.components.map((item) => affected.has(item.id) ? { ...item, active: false } : item);
    const updated = addAudit({ ...device, components, repairs: [record, ...device.repairs] }, currentUser(state)?.name ?? "User", "Repair record appended");
    return { state: withDevice(state, updated), value: updated };
  },
  amendRepair(state: AppState, deviceId: string, repairId: string, note: string) {
    // TODO: Antigravity - replace with REST call to POST /api/repairs/{id}/amend
    const device = api.getDevice(state, deviceId);
    if (!device) throw new Error("Device passport not found.");
    const user = currentUser(state);
    const updated = addAudit({ ...device, repairs: device.repairs.map((record) => record.id === repairId ? { ...record, amendments: [...record.amendments, { id: uid("amendment"), note, createdAt: nowIso(), authorName: user?.name ?? "User" }] } : record) }, user?.name ?? "User", "Repair amendment appended");
    return { state: withDevice(state, updated), value: updated };
  },
  assessDevice(state: AppState, id: string) {
    // TODO: Antigravity - replace with REST call to POST /api/devices/{id}/assessment
    const device = api.getDevice(state, id);
    return device ? calculateAssessment(device) : null;
  },
  async identifyComponent(file: File, forceLowConfidence = false) {
    // TODO: Antigravity - replace with REST call to POST /api/ai/identify-component
    if (!file.type.startsWith("image/")) throw new Error("415 · Upload a JPEG or PNG image.");
    if (file.type !== "image/jpeg" && file.type !== "image/png") throw new Error("415 · Only JPEG and PNG images are supported.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller.");
    await new Promise((resolve) => window.setTimeout(resolve, 950));
    const predictions = [
      { label: "Battery", type: "BATTERY" as const, confidence: forceLowConfidence ? 38 : 91 },
      { label: "RAM module", type: "RAM" as const, confidence: forceLowConfidence ? 27 : 6 },
      { label: "SSD / hard drive", type: "SSD" as const, confidence: forceLowConfidence ? 19 : 3 },
    ];
    return { predictions, reliable: predictions[0]?.confidence !== undefined && predictions[0].confidence >= 60 };
  },
  adminStats(state: AppState) {
    // TODO: Antigravity - replace with REST call to GET /api/admin/stats
    return {
      users: state.users.length,
      devices: state.devices.length,
      repairs: state.devices.reduce((total, device) => total + device.repairs.length, 0),
      pendingTechnicians: state.users.filter((user) => user.role === "TECHNICIAN" && user.status === "PENDING").length,
    };
  },
  adminUsers(state: AppState) {
    // TODO: Antigravity - replace with REST call to GET /api/admin/users
    return state.users;
  },
  approveTechnician(state: AppState, id: string) {
    // TODO: Antigravity - replace with REST call to PUT /api/admin/technicians/{id}/approve
    const users = state.users.map((user) => user.id === id && user.role === "TECHNICIAN" ? { ...user, status: "ACTIVE" as AccountStatus } : user);
    return { state: { ...state, users }, value: users.find((user) => user.id === id) ?? null };
  },
  rejectTechnician(state: AppState, id: string) {
    // Demo-only reject action; the provided REST contract covers approvals only.
    const users = state.users.map((user) => user.id === id && user.role === "TECHNICIAN" ? { ...user, status: "REJECTED" as AccountStatus } : user);
    return { state: { ...state, users }, value: users.find((user) => user.id === id) ?? null };
  },
  resetDemo() {
    // Reset the complete local demo data set to the seeded accounts and devices.
    return createDemoState();
  },
};