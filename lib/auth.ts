export interface UserProfile {
  name: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  createdAt: string;
}

const KEY = 'surakshasos_user';

export function getUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: UserProfile): void {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}

export function clearUser(): void {
  localStorage.removeItem(KEY);
}
