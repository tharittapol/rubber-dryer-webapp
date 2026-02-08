export type ApiError = {
  message: string;
  code?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    let err: ApiError = { message: `Request failed (${res.status})` };
    try {
      err = await res.json();
    } catch {}
    throw new Error(err.message);
  }
  return res.json() as Promise<T>;
}
