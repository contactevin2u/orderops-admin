export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'https://orderops-api.onrender.com';

export const API = (p: string) =>
  /^https?:\/\//i.test(p) ? p : `${API_BASE}${p}`;

export async function getJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API(path), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`GET ${path} ${res.status}`);
  return res.json() as Promise<T>;
}

export async function postJSON<T>(
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(API(path), {
    method: 'POST',
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = '';
    try { detail = JSON.stringify(await res.json()); } catch {}
    throw new Error(`POST ${path} ${res.status} ${detail}`);
  }
  return res.json() as Promise<T>;
}

export const uuid = (): string => {
  try {
    const g: any = globalThis as any;
    if (g?.crypto?.randomUUID) return g.crypto.randomUUID();
  } catch {}
  return `${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
};
