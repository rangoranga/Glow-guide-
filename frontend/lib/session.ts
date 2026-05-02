export interface BareIQUser {
  id: string;
  name: string;
  email: string;
  skinGoal: string;
  createdAt: string;
}

const USER_KEY = "bareiq_user";
const PENDING_DESTINATION_KEY = "bareiq_pending_destination";

export function getBareIQUser(): BareIQUser | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(USER_KEY);
  return stored ? (JSON.parse(stored) as BareIQUser) : null;
}

export function saveBareIQUser(input: { name: string; email: string; skinGoal: string }) {
  const existing = getBareIQUser();
  const user: BareIQUser = {
    id: existing?.id || crypto.randomUUID(),
    name: input.name.trim() || "BareIQ Member",
    email: input.email.trim(),
    skinGoal: input.skinGoal.trim(),
    createdAt: existing?.createdAt || new Date().toISOString(),
  };
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function savePendingDestination(destination: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_DESTINATION_KEY, destination);
}

export function consumePendingDestination(fallback: string) {
  if (typeof window === "undefined") return fallback;
  const destination = window.localStorage.getItem(PENDING_DESTINATION_KEY) || fallback;
  window.localStorage.removeItem(PENDING_DESTINATION_KEY);
  return destination;
}

export function gatedPath(destination: string) {
  return `/login?next=${encodeURIComponent(destination)}`;
}

export function getStoredDestination() {
  if (typeof window === "undefined") return "/";
  return window.localStorage.getItem(PENDING_DESTINATION_KEY) || "/";
}
