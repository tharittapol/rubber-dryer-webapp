export function setAuthCookie(token: string) {
  document.cookie = `rd_auth=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
}

export function clearAuthCookie() {
  document.cookie = `rd_auth=; path=/; Max-Age=0; SameSite=Lax`;
}

export function setRoleCookie(role: "ADMIN" | "USER" | "VIEWER") {
  document.cookie = `rd_role=${encodeURIComponent(role)}; path=/; SameSite=Lax`;
}

export function clearRoleCookie() {
  document.cookie = `rd_role=; path=/; Max-Age=0; SameSite=Lax`;
}