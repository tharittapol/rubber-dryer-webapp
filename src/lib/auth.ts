/**
 * Prototype auth helpers for UI development.
 *
 * Production recommendation:
 * - Use httpOnly cookies for refresh token
 * - Validate session server-side
 * - Apply RBAC (ADMIN/USER/VIEWER/OPERATOR)
 */
export const AUTH_COOKIE = "rd_token";

export function setAuthCookie(token: string) {
  // Prototype-only: client-side cookie. Replace with httpOnly cookie in production.
  document.cookie = `${AUTH_COOKIE}=${token}; path=/; max-age=${60 * 60 * 12}`;
}

export function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
}
