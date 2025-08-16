export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://orderops-api.onrender.com";

export const API = (p: string) =>
  `${API_BASE}${p.startsWith("/") ? p : `/${p}`}`;

export async function getJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API(path), { ...init, cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function postJSON<T>(path: string, body: any, init?: RequestInit): Promise<T> {
  const res = await fetch(API(path), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    body: JSON.stringify(body),
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
