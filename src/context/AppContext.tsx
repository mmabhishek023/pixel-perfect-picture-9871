import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api, createDemoState, type Mutation } from "@/services/api";
import type {
  AppState,
  ComponentInput,
  DeviceAssessment,
  DeviceInput,
  DevicePassport,
  DeviceStatus,
  PassportUser,
  RepairInput,
  UserRole,
} from "@/types/passport";

interface AppContextValue {
  state: AppState;
  currentUser: PassportUser | null;
  devices: DevicePassport[];
  demoLogin: (role: UserRole) => void;
  login: (email: string, password: string) => PassportUser;
  signup: (name: string, email: string, role: UserRole) => PassportUser;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  resetDemo: () => void;
  registerDevice: (input: DeviceInput) => DevicePassport;
  updateDevice: (id: string, changes: Partial<Pick<DevicePassport, "status" | "os" | "ramGb" | "storageGb" | "processor" | "model" | "name">>) => DevicePassport;
  transferDevice: (id: string, email: string) => DevicePassport;
  addComponent: (id: string, input: ComponentInput) => DevicePassport;
  addRepair: (id: string, input: RepairInput) => void;
  amendRepair: (deviceId: string, repairId: string, note: string) => void;
  approveTechnician: (id: string) => void;
  rejectTechnician: (id: string) => void;
  getDevice: (id: string) => DevicePassport | null;
  getPublicPassport: (token: string) => DevicePassport | null;
  getQr: (id: string) => string | null;
  getAssessment: (id: string) => DeviceAssessment | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => createDemoState());
  const stateRef = useRef(state);

  useEffect(() => {
    const saved = api.loadState();
    stateRef.current = saved;
    setState(saved);
  }, []);

  const transact = useCallback(<T,>(mutation: (previous: AppState) => Mutation<T>): T => {
    const result = mutation(stateRef.current);
    stateRef.current = result.state;
    setState(result.state);
    api.saveState(result.state);
    return result.value;
  }, []);

  const currentUser = state.users.find((user) => user.id === state.currentUserId) ?? null;
  const devices = api.listDevices(state, currentUser?.id ?? null);

  const demoLogin = useCallback((role: UserRole) => {
    transact((previous) => api.demoLogin(previous, role));
  }, [transact]);
  const login = useCallback((email: string, password: string) => {
    return transact((previous) => api.login(previous, email, password));
  }, [transact]);
  const signup = useCallback((name: string, email: string, role: UserRole) => {
    return transact((previous) => api.signup(previous, name, email, role));
  }, [transact]);
  const logout = useCallback(() => {
    transact((previous) => api.logout(previous));
  }, [transact]);
  const switchRole = useCallback((role: UserRole) => {
    transact((previous) => api.demoLogin(previous, role));
  }, [transact]);
  const resetDemo = useCallback(() => {
    const next = api.resetDemo();
    stateRef.current = next;
    setState(next);
    api.saveState(next);
  }, []);
  const registerDevice = useCallback((input: DeviceInput) => {
    return transact((previous) => api.registerDevice(previous, input));
  }, [transact]);
  const updateDevice = useCallback((id: string, changes: Parameters<typeof api.updateDevice>[2]) => {
    return transact((previous) => api.updateDevice(previous, id, changes));
  }, [transact]);
  const transferDevice = useCallback((id: string, email: string) => {
    return transact((previous) => api.transferDevice(previous, id, email));
  }, [transact]);
  const addComponent = useCallback((id: string, input: ComponentInput) => {
    return transact((previous) => api.addComponent(previous, id, input));
  }, [transact]);
  const addRepair = useCallback((id: string, input: RepairInput) => {
    transact((previous) => api.addRepair(previous, id, input));
  }, [transact]);
  const amendRepair = useCallback((deviceId: string, repairId: string, note: string) => {
    transact((previous) => api.amendRepair(previous, deviceId, repairId, note));
  }, [transact]);
  const approveTechnician = useCallback((id: string) => {
    transact((previous) => api.approveTechnician(previous, id));
  }, [transact]);
  const rejectTechnician = useCallback((id: string) => {
    transact((previous) => api.rejectTechnician(previous, id));
  }, [transact]);
  const getDevice = useCallback((id: string) => api.getDevice(stateRef.current, id), []);
  const getPublicPassport = useCallback((token: string) => api.getPublicPassport(stateRef.current, token), []);
  const getQr = useCallback((id: string) => api.getQr(stateRef.current, id), []);
  const getAssessment = useCallback((id: string) => api.assessDevice(stateRef.current, id), []);

  const value = useMemo<AppContextValue>(() => ({
    state,
    currentUser,
    devices,
    demoLogin,
    login,
    signup,
    logout,
    switchRole,
    resetDemo,
    registerDevice,
    updateDevice,
    transferDevice,
    addComponent,
    addRepair,
    amendRepair,
    approveTechnician,
    rejectTechnician,
    getDevice,
    getPublicPassport,
    getQr,
    getAssessment,
  }), [state, currentUser, devices, demoLogin, login, signup, logout, switchRole, resetDemo, registerDevice, updateDevice, transferDevice, addComponent, addRepair, amendRepair, approveTechnician, rejectTechnician, getDevice, getPublicPassport, getQr, getAssessment]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider.");
  return context;
}

export function useAppApi() {
  return api;
}

export type { DeviceStatus };