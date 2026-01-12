// Password utility functions

const PASSWORD_STORAGE_KEY = 'delete_password';

/**
 * Save password to localStorage
 */
export function saveDeletePassword(password: string): void {
  localStorage.setItem(PASSWORD_STORAGE_KEY, password);
}

/**
 * Get password from localStorage
 */
export function getDeletePassword(): string | null {
  return localStorage.getItem(PASSWORD_STORAGE_KEY);
}

/**
 * Check if password is set
 */
export function isPasswordSet(): boolean {
  return !!getDeletePassword();
}

/**
 * Verify password
 */
export function verifyPassword(password: string): boolean {
  const savedPassword = getDeletePassword();
  if (!savedPassword) return false;
  return password === savedPassword;
}

/**
 * Clear password
 */
export function clearPassword(): void {
  localStorage.removeItem(PASSWORD_STORAGE_KEY);
}
