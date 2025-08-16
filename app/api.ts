export function API(path: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
  return `${base}${path}`;
}
async function handle<T>(r: Response): Promise<T> {
  const text = await r.text(); let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch {}
  if (!r.ok) { const detail = (data?.detail ?? data?.message ?? text) || r.statusText; const err: any = new Error(detail); (err as any).status = r.status; (err as any).body = (data ?? text); throw err; }
  return (data as T);
}
export async function postJSON<T>(url: string, body: any, headers: Record<string,string> = {}): Promise<T> {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
  return handle<T>(r);
}
export async function getJSON<T>(url: string): Promise<T> { const r = await fetch(url, { cache: "no-store" }); return handle<T>(r); }
export const fmtMoney = (v:number)=> `RM ${v.toFixed(2)}`;
