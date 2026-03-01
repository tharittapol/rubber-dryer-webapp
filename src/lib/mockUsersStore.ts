export type Role = "ADMIN" | "USER" | "VIEWER";

export type UserRow = {
  id: string;
  fullName: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  lineId: string;
  role: Role;
  factoryIds: string[];
};

export type FactoryOption = { id: string; name: string };

export type UsersMock = {
  users: UserRow[];
  factories: FactoryOption[];
};

type UsersSeed = { seedVersion?: string; users: UserRow[] };

const LS_KEY = "rd_mock_users_v1";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Ensure store exists:
 * - if localStorage already has data -> use it
 * - else fetch /mock/users.json then seed localStorage
 */
export async function ensureUsersStore(): Promise<UsersMock> {
  if (typeof window === "undefined") return { users: [], factories: [] };

  const [usersRes, facRes] = await Promise.all([
    fetch("/mock/users.json", { cache: "no-store" }),
    fetch("/mock/factories.json", { cache: "no-store" }),
  ]);

  const seed = (await usersRes.json()) as UsersSeed;
  const facJson = (await facRes.json()) as { factories?: Array<{ id: string; name: string }> };

  const seedVersion = seed.seedVersion ?? "v0";

  const factories: FactoryOption[] = (facJson.factories ?? []).map((f) => ({ id: f.id, name: f.name }));
  const users: UserRow[] = seed.users ?? [];

  const cached = safeParse<(UsersMock & { seedVersion?: string })>(localStorage.getItem(LS_KEY));

  if (!cached?.users || !cached?.factories || (cached.seedVersion ?? "v0") !== seedVersion) {
    const next: UsersMock & { seedVersion?: string } = {
      seedVersion,
      factories,
      users,
    };
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    return next;
  }

  // Always refresh factories from factories.json (single source of truth)
  return { ...cached, factories };
}

export function readUsersStore(): UsersMock {
  if (typeof window === "undefined") return { users: [], factories: [] };
  return (
    safeParse<UsersMock>(localStorage.getItem(LS_KEY)) ?? {
      users: [],
      factories: [],
    }
  );
}

export function writeUsersStore(next: UsersMock) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(next));
}