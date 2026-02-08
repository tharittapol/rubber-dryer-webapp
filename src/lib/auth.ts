/**
 * Skeleton auth for UI prototyping.
 * Production: use httpOnly cookies + server-side session/refresh token.
 */
export const AUTH_COOKIE = "rd_token";

export function setAuthCookie(token: string) {
  // Client-side cookie for prototype; switch to httpOnly in production.
  document.cookie = `${AUTH_COOKIE}=${token}; path=/; max-age=${60 * 60 * 12}`;
}

export function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
}
