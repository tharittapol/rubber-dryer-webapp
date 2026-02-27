export type Role = "ADMIN" | "USER" | "VIEWER";

export function getClientRole(): Role | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("rd_auth_user");
    if (!raw) return null;
    const obj = JSON.parse(raw) as { role?: Role };
    if (obj.role === "ADMIN" || obj.role === "USER" || obj.role === "VIEWER") return obj.role;
    return null;
  } catch {
    return null;
  }
}

export function canUseFeature(role: Role, feature: "SETTINGS" | "CONTROL" | "DASHBOARD") {
  if (role === "ADMIN") return true;
  if (feature === "DASHBOARD") return true;
  if (feature === "CONTROL") return role === "USER";
  if (feature === "SETTINGS") return false;
  return false;
}