/**
 * Safe client-side storage helper that guards against SSR (Node/server environment)
 * and storage access errors (private browsing, disabled cookies, quota exceeded).
 */

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function safeGet(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Silently ignore quota exceeded or permission errors
  }
}

export function safeRemove(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Silently ignore permission errors
  }
}

export function safeSessionGet(key: string): string | null {
  if (typeof window === "undefined" || typeof window.sessionStorage === "undefined") return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSessionSet(key: string, value: string): void {
  if (typeof window === "undefined" || typeof window.sessionStorage === "undefined") return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Silently ignore
  }
}

export function safeSessionRemove(key: string): void {
  if (typeof window === "undefined" || typeof window.sessionStorage === "undefined") return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Silently ignore
  }
}
