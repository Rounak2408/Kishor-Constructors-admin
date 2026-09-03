/**
 * LocalStorage persistence helpers for Kishor Construction ERP.
 * Used by AppContext for interactive CRUD with browser persistence.
 */

const STORAGE_PREFIX = 'kc_';

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // Ignore quota errors in demo mode
  }
}

export function removeFromStorage(key: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
}

export function clearAllAppStorage(): void {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(STORAGE_PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}
