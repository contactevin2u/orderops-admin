"use client";
import { useEffect, useState } from "react";
import type { ListOrderRow } from "../../lib/types";
import { getJSON } from "../../lib/api";
import Link from "next/link";

export default function Orders(){
  const [q,setQ] = useState("");
  const [rows,setRows] = useState<ListOrderRow[]>([]);
  async function load(){
    const url = new URL("/orders", location.origin);
    if (q.trim()) url.searchParams.set("q", q.trim());
    const res = await getJSON<{orders:ListOrderRow[]; total:number}>(url.pathname + url.search);
    setRows(res.orders || []);
  }
  useEffect(()=>{ load(); }, []);
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Orders</h1>
      <div className="flex gap-2">
        <input className="border p-2 rounded flex-1" placeholder="Search code/name/phone" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="px-3 py-2 bg-gray-700 text-white rounded" onClick={load}>Search</button>
      </div>
      <div className="border rounded">
        <table className="w-full">
          <thead><tr className="text-left text-sm text-gray-500">
            <th className="p-2">Code</th><th>Type</th><th>Customer</th><th>Phone</th><th>Outstanding</th><th></th>
          </tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.code} className="border-t">
                <td className="p-2">{r.code}</td>
                <td>{r.type}</td>
                <td>{r.customer?.name}</td>
                <td>{r.customer?.phone||"-"}</td>
                <td>RM {r.outstanding?.toFixed?.(2)}</td>
                <td className="text-right p-2"><Link className="text-blue-600" href={`/orders/${r.code}`}>Open</Link></td>
              </tr>
            ))}
            {rows.length===0 && <tr><td className="p-3 text-gray-500" colSpan={6}>No orders.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
