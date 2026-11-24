import type {
  AccountStatus,
  AppState,
  ComponentInput,
  DeviceInput,
  DevicePassport,
  DeviceInternalStatus,
  DevicePayoutStatus,
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
      internalStatus: "REFURBISHED" as DeviceInternalStatus,
      payoutStatus: "PAID" as DevicePayoutStatus,
      payoutAmount: 32000,
      ownerPhotos: [],
      listingPhotos: [
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23134e4a'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%232dd4bf' font-family='sans-serif' font-size='20'>ExampleBook 14 · Refurbished</text></svg>",
      ],
      activeDamages: [],
      resolvedDamages: ["Body Dents/Scratches"],
      isListedForSale: true,
      listingPrice: 34999,
      listingCondition: "Good (Grade B)",
      listingNotes: "Certified refurbished laptop. Fresh battery and display replacement installed. 8 GB RAM, 512 GB SSD.",
      ownerId: "user-owner",
      qrToken: "Xk3u9QmZc0Wb5T1hYpL2aA",
      previousOwnersCount: 1,
      knownDamages: ["Body Dents/Scratches"],
      damageNotes: "Minor surface scuffs on bottom aluminum cover",
      priorHistory: "Previously purchased certified refurbished in 2023; single owner prior.",
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
      ramGb: 8, storageGb: 256, processor: "Example A18", status: "IN_USE",
      internalStatus: "REFURBISHED" as DeviceInternalStatus,
      payoutStatus: "PAYMENT_INITIATED" as DevicePayoutStatus,
      payoutAmount: 18500,
      ownerPhotos: [],
      listingPhotos: [
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f172a'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2338bdf8' font-family='sans-serif' font-size='20'>ExamplePhone X · Grade A</text></svg>",
      ],
      activeDamages: [], resolvedDamages: [],
      isListedForSale: true,
      listingPrice: 22999,
      listingCondition: "Like New (Grade A)",
      listingNotes: "Certified refurbished smartphone. Verified pristine condition, 94% original battery health, 256 GB storage.",
      ownerId: "user-owner", qrToken: "pH8mR2vQ6sL1tK9cZ4wN3g",
      previousOwnersCount: 0, knownDamages: [], damageNotes: "", priorHistory: "Purchased brand new from authorized retailer in original sealed packaging.",
      components: [component("c-battery-118", "BATTERY", "ORIGINAL", "GOOD", 94), component("c-display-118", "DISPLAY", "ORIGINAL", "GOOD"), component("c-camera-118", "CAMERA", "ORIGINAL", "GOOD"), component("c-ram-118", "RAM", "ORIGINAL", "GOOD", null, true, "8 GB"), component("c-ssd-118", "SSD", "ORIGINAL", "GOOD", null, true, "256 GB")],
      repairs: [], audit: [], createdAt: "2025-09-01T09:00:00.000Z",
    },
    {
      id: "device-097", passportId: "RTP-2026-000097", name: "ExampleBook Pro", deviceType: "LAPTOP",
      brand: "ExampleBrand", model: "ExampleBook Pro", serial: "SN1234560097", purchaseDate: "2019-02-10", os: "Windows 10",
      ramGb: 16, storageGb: 512, processor: "Intel Core i7", status: "UNDER_REPAIR",
      internalStatus: "PENDING_INSPECTION" as DeviceInternalStatus,
      payoutStatus: "PENDING_INSPECTION" as DevicePayoutStatus,
      payoutAmount: null,
      ownerPhotos: [], listingPhotos: [], activeDamages: ["Screen Crack", "Battery Swelling/Drain"], resolvedDamages: [],
      isListedForSale: false,
      listingPrice: null,
      listingCondition: null,
      listingNotes: null,
      ownerId: "user-owner", qrToken: "vL4qS8nM2wJ6cR1pX9kT5a",
      previousOwnersCount: 2, knownDamages: ["Screen Crack", "Battery Swelling/Drain"], damageNotes: "Visible hairline crack across upper bezel and battery health severely degraded.", priorHistory: "Serviced 5 times for recurring thermal throttling and power issues.",
      components: [component("c-battery-097", "BATTERY", "REPLACED", "POOR", 40), component("c-display-097", "DISPLAY", "REPLACED", "POOR"), component("c-board-097", "MOTHERBOARD", "REPLACED", "POOR"), component("c-ssd-097", "SSD", "ORIGINAL", "FAIR")],
      repairs: Array.from({ length: 5 }, (_, index) => repair(`repair-097-${index + 1}`, `202${index}-04-10`, `Service visit ${index + 1}`, "Pratham Gupta", 1800 + index * 250, [], true)),
      audit: [], createdAt: "2019-02-10T09:00:00.000Z",
    },
    {
      id: "device-090", passportId: "RTP-2026-000090", name: "ExamplePhone Lite", deviceType: "SMARTPHONE",
      brand: "ExampleBrand", model: "ExamplePhone Lite", serial: "IMEI000000000090", purchaseDate: "2023-04-03", os: "Android 14",
      ramGb: 6, storageGb: 128, processor: "Example A12", status: "FOR_SALE",
      internalStatus: "REFURBISHED" as DeviceInternalStatus,
      payoutStatus: "PAYMENT_INITIATED" as DevicePayoutStatus,
      payoutAmount: 8500,
      ownerPhotos: [], listingPhotos: [], activeDamages: [], resolvedDamages: ["Camera/Speaker Fault"],
      isListedForSale: false,
      listingPrice: null,
      listingCondition: null,
      listingNotes: null,
      ownerId: "user-owner", qrToken: "mB6kP3xR8zF1vW9dY2aN4q",
      components: [component("c-battery-090", "BATTERY", "ORIGINAL", "FAIR", 72), component("c-display-090", "DISPLAY", "ORIGINAL", "GOOD"), component("c-camera-090", "CAMERA", "ORIGINAL", "GOOD")],
      repairs: [repair("repair-090-1", "2024-01-12", "Charging port cleaned", "Owner reported", 0, [], false)],
      audit: [], createdAt: "2023-04-03T09:00:00.000Z",
    },
    {
      id: "device-071", passportId: "RTP-2026-000071", name: "ExamplePhone Z", deviceType: "SMARTPHONE",
      brand: "ExampleBrand", model: "ExamplePhone Z", serial: "IMEI000000000071", purchaseDate: "2021-05-18", os: "Android 13",
      ramGb: 8, storageGb: 128, processor: "Example A10", status: "REFURBISHING",
      internalStatus: "PENDING_INSPECTION" as DeviceInternalStatus,
      payoutStatus: "PENDING_INSPECTION" as DevicePayoutStatus,
      payoutAmount: null,
      ownerPhotos: [], listingPhotos: [], activeDamages: [], resolvedDamages: [],
      isListedForSale: false,
      listingPrice: null,
      listingCondition: null,
      listingNotes: null,
      ownerId: "user-owner", qrToken: "qC7nH2wL5xM8rV1pB4zK9a",
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

function normalizeDevice(d: any): DevicePassport {
  const status: DeviceStatus = d.status ?? "REGISTERED";
  let internalStatus: DeviceInternalStatus = d.internalStatus;
  if (!internalStatus || !["PENDING_INSPECTION", "REFURBISHED", "RECYCLED"].includes(internalStatus)) {
    internalStatus = status === "RECYCLED" ? "RECYCLED" : (status === "FOR_SALE" || status === "IN_USE") ? "REFURBISHED" : "PENDING_INSPECTION";
  }
  let payoutStatus: DevicePayoutStatus = d.payoutStatus;
  if (!payoutStatus || !["PENDING_INSPECTION", "PAYMENT_INITIATED", "PAID"].includes(payoutStatus)) {
    payoutStatus = internalStatus === "REFURBISHED" ? "PAID" : "PENDING_INSPECTION";
  }
  return {
    id: d.id || uid("device"),
    passportId: d.passportId || "RTP-2026-000000",
    name: d.name || `${d.brand ?? "Device"} ${d.model ?? ""}`.trim(),
    deviceType: d.deviceType ?? "SMARTPHONE",
    brand: d.brand ?? "Generic",
    model: d.model ?? "Generic",
    serial: d.serial ?? "UNKNOWN",
    purchaseDate: d.purchaseDate ?? "2024-01-01",
    os: d.os ?? "Other",
    ramGb: typeof d.ramGb === "number" ? d.ramGb : null,
    storageGb: typeof d.storageGb === "number" ? d.storageGb : null,
    processor: d.processor ?? "",
    previousOwnersCount: typeof d.previousOwnersCount === "number" ? d.previousOwnersCount : 0,
    knownDamages: Array.isArray(d.knownDamages) ? d.knownDamages : [],
    damageNotes: typeof d.damageNotes === "string" ? d.damageNotes : "",
    priorHistory: typeof d.priorHistory === "string" ? d.priorHistory : "",
    status,
    internalStatus,
    payoutStatus,
    payoutAmount: typeof d.payoutAmount === "number" ? d.payoutAmount : null,
    ownerPhotos: Array.isArray(d.ownerPhotos) ? d.ownerPhotos : [],
    listingPhotos: Array.isArray(d.listingPhotos) ? d.listingPhotos : [],
    activeDamages: Array.isArray(d.activeDamages) ? d.activeDamages : (Array.isArray(d.knownDamages) ? d.knownDamages : []),
    resolvedDamages: Array.isArray(d.resolvedDamages) ? d.resolvedDamages : [],
    isListedForSale: Boolean(d.isListedForSale),
    listingPrice: typeof d.listingPrice === "number" ? d.listingPrice : null,
    listingCondition: typeof d.listingCondition === "string" ? d.listingCondition : null,
    listingNotes: typeof d.listingNotes === "string" ? d.listingNotes : null,
    ownerId: d.ownerId ?? "user-owner",
    qrToken: d.qrToken ?? secureToken(),
    components: Array.isArray(d.components) ? d.components : [],
    repairs: Array.isArray(d.repairs) ? d.repairs : [],
    audit: Array.isArray(d.audit) ? d.audit : [],
    createdAt: d.createdAt ?? nowIso(),
    updatedAt: d.updatedAt ?? d.createdAt ?? nowIso(),
  };
}

export const api = {
  loadState(): AppState {
    if (typeof window === "undefined") return createDemoState();
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const demo = createDemoState();
          const existingUserIds = new Set(Array.isArray(parsed.users) ? parsed.users.map((u: any) => u.id) : []);
          const mergedUsers: PassportUser[] = Array.isArray(parsed.users) ? [...parsed.users] : [...demo.users];
          for (const u of demo.users) {
            if (!existingUserIds.has(u.id)) {
              mergedUsers.push(u);
            }
          }
          const rawDevices = Array.isArray(parsed.devices) && parsed.devices.length > 0 ? parsed.devices : demo.devices;
          const devices = rawDevices.map(normalizeDevice);
          const currentUserId = parsed.currentUserId && mergedUsers.some((u) => u.id === parsed.currentUserId)
            ? parsed.currentUserId
            : "user-owner";
          return { users: mergedUsers, devices, currentUserId };
        }
      }
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
    if (user?.role === "VIEWER") {
      return state.devices.filter((device) => device.internalStatus === "REFURBISHED" && device.isListedForSale === true);
    }
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
      internalStatus: "PENDING_INSPECTION" as DeviceInternalStatus,
      payoutStatus: "PENDING_INSPECTION" as DevicePayoutStatus,
      payoutAmount: null,
      ownerPhotos: input.ownerPhotos ?? [],
      listingPhotos: [],
      activeDamages: input.knownDamages ?? [],
      resolvedDamages: [],
      isListedForSale: false,
      listingPrice: null,
      listingCondition: null,
      listingNotes: null,
      ownerId: user.id,
      qrToken: secureToken(),
      components: [
        { ...component(uid("component"), "BATTERY", "ORIGINAL", "GOOD", null), installedAt: nowIso() },
      ],
      repairs: [],
      audit: [
        {
          id: uid("audit"),
          date: nowIso(),
          actor: user.name,
          action: `Device passport created (${input.previousOwnersCount ?? 0} prev owner(s)${input.knownDamages?.length ? `, ${input.knownDamages.length} damage(s)` : ""}${input.priorHistory ? ", prior history noted" : ""})`,
        },
      ],
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
    const user = currentUser(state);
    if (!user || user.role !== "ADMIN") {
      throw new Error("Only platform Admins can transfer device ownership to buyers.");
    }
    const device = api.getDevice(state, id);
    if (!device) throw new Error("Device passport not found.");
    const recipient = state.users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase() && candidate.status === "ACTIVE");
    if (!recipient) throw new Error("No active account matches that email.");
    if (recipient.id === device.ownerId) {
      throw new Error("This device is already owned by this account.");
    }
    const updated = addAudit(
      {
        ...device,
        ownerId: recipient.id,
        isListedForSale: false,
        qrToken: secureToken(),
        updatedAt: nowIso(),
      },
      user.name,
      `Ownership transferred to buyer ${recipient.name} (${recipient.email}); previous QR token revoked & regenerated`,
    );
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
  completeInspection(
    state: AppState,
    deviceId: string,
    payload: {
      outcome: 'REFURBISHED' | 'RECYCLED';
      payoutAmount?: number | null;
      resolvedDamageIds: string[];
      extraActiveDamages: string[];
      repairRecord: RepairInput;
      listingPhotos: string[];
    },
  ): Mutation<DevicePassport> {
    // TODO: Antigravity - replace with REST call to POST /api/devices/{id}/complete-inspection
    const device = api.getDevice(state, deviceId);
    if (!device) throw new Error("Device passport not found.");
    const user = currentUser(state);
    const verified = user?.role === "TECHNICIAN" && user.status === "ACTIVE";
    const repairEntry = {
      id: uid("repair"),
      ...payload.repairRecord,
      technicianId: verified && user ? user.id : null,
      technicianName: verified && user ? user.name : user?.name ?? "Technician",
      verified,
      amendments: [],
    };
    const remaining = (device.activeDamages ?? []).filter(
      (dmg) => !payload.resolvedDamageIds.includes(dmg),
    );
    const newActive = [...remaining, ...payload.extraActiveDamages];
    const newResolved = [...(device.resolvedDamages ?? []), ...payload.resolvedDamageIds];
    const updated = addAudit(
      {
        ...device,
        internalStatus: payload.outcome as DeviceInternalStatus,
        payoutStatus: "PAYMENT_INITIATED" as DevicePayoutStatus,
        payoutAmount: typeof payload.payoutAmount === "number" ? payload.payoutAmount : device.payoutAmount,
        activeDamages: newActive,
        resolvedDamages: newResolved,
        listingPhotos: payload.listingPhotos,
        isListedForSale: false,
        repairs: [repairEntry, ...device.repairs],
        updatedAt: nowIso(),
      },
      user?.name ?? "Technician",
      `Inspection complete: marked as ${payload.outcome}; sent to Admin for payout review`,
    );
    return { state: withDevice(state, updated), value: updated };
  },
  adminApprovePayoutAndListing(
    state: AppState,
    deviceId: string,
    payload: {
      payoutAmount: number;
      isListedForSale: boolean;
      listingPrice?: number | null;
      listingCondition?: string | null;
      listingNotes?: string | null;
    },
  ): Mutation<DevicePassport> {
    const device = api.getDevice(state, deviceId);
    if (!device) throw new Error("Device passport not found.");
    const user = currentUser(state);
    const updated = addAudit(
      {
        ...device,
        payoutAmount: payload.payoutAmount,
        payoutStatus: "PAID" as DevicePayoutStatus,
        isListedForSale: payload.isListedForSale,
        listingPrice: payload.isListedForSale ? (payload.listingPrice ?? null) : null,
        listingCondition: payload.isListedForSale ? (payload.listingCondition ?? null) : null,
        listingNotes: payload.isListedForSale ? (payload.listingNotes ?? null) : null,
        updatedAt: nowIso(),
      },
      user?.name ?? "Admin",
      `Trade-in payout \u20B9${payload.payoutAmount.toLocaleString("en-IN")} approved & marked as PAID${
        payload.isListedForSale ? `; published to marketplace at \u20B9${(payload.listingPrice ?? 0).toLocaleString("en-IN")}` : ""
      }`,
    );
    return { state: withDevice(state, updated), value: updated };
  },
  listDeviceForSale(
    state: AppState,
    deviceId: string,
    payload: {
      price: number;
      condition: string;
      notes: string;
      listingPhotos?: string[];
    },
  ): Mutation<DevicePassport> {
    const device = api.getDevice(state, deviceId);
    if (!device) throw new Error("Device passport not found.");
    if (device.internalStatus !== "REFURBISHED") {
      throw new Error("Only refurbished devices can be listed for sale.");
    }
    const user = currentUser(state);
    const photos = payload.listingPhotos && payload.listingPhotos.length > 0
      ? payload.listingPhotos
      : device.listingPhotos;
    const updated = addAudit(
      {
        ...device,
        isListedForSale: true,
        listingPrice: payload.price,
        listingCondition: payload.condition,
        listingNotes: payload.notes,
        listingPhotos: photos,
      },
      user?.name ?? "Technician",
      `Listing published for sale at \u20B9${payload.price.toLocaleString("en-IN")} (${payload.condition})`,
    );
    return { state: withDevice(state, updated), value: updated };
  },
  unlistDevice(state: AppState, deviceId: string): Mutation<DevicePassport> {
    const device = api.getDevice(state, deviceId);
    if (!device) throw new Error("Device passport not found.");
    const user = currentUser(state);
    const updated = addAudit(
      {
        ...device,
        isListedForSale: false,
      },
      user?.name ?? "Technician",
      "Device unlisted from public catalog",
    );
    return { state: withDevice(state, updated), value: updated };
  },
  markAsPaid(state: AppState, deviceId: string): Mutation<DevicePassport> {
    // TODO: Antigravity - replace with REST call to POST /api/devices/{id}/mark-paid
    const device = api.getDevice(state, deviceId);
    if (!device) throw new Error("Device passport not found.");
    const user = currentUser(state);
    const updated = addAudit(
      { ...device, payoutStatus: "PAID" as DevicePayoutStatus },
      user?.name ?? "Admin",
      "Payout marked as PAID",
    );
    return { state: withDevice(state, updated), value: updated };
  },
};