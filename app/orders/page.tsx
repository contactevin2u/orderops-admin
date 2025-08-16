"use client";
import { useEffect, useMemo, useState } from "react";
import { API, getJSON, fmtMoney } from "../api";
type Row = { order_code: string; type: string; status: string; name: string; phone?: string; created_at: string; outstanding: number };
type Resp = { orders: Row[] };
export default function OrdersPage(){
  const [q,setQ]=useState(""); const [rows,setRows]=useState<Row[]>([]);
  async function load(){ const sp=new URLSearchParams(); if(q) sp.set("search",q); const r = await getJSON<Resp>(API(`/orders?${sp.toString()}`)); setRows(r.orders); }
  useEffect(()=>{ load(); },[]);
  return (<div className="stack">
    <div className="row"><div className="title" style={{flex:1}}>Orders</div>
      <input aria-label="Search orders" className="input" placeholder="Search code, name, phone" value={q} onChange={e=>setQ(e.target.value)} style={{maxWidth:260}}/>
      <button className="btn" onClick={()=>load()}>Filter</button>
      <a className="btn" href={API("/export/csv")} target="_blank" rel="noreferrer">Export CSV</a>
    </div>
    <table><thead><tr><th>Code</th><th>Customer</th><th>Type</th><th>Status</th><th>Created</th><th style={{textAlign:"right"}}>Outstanding</th></tr></thead>
      <tbody>
        {rows.map(r=> (<tr key={r.order_code} onClick={()=>window.location.href=`/orders/${encodeURIComponent(r.order_code)}`} style={{cursor:"pointer"}}>
          <td>{r.order_code}</td><td>{r.name}</td><td>{r.type}</td><td>{r.status}</td><td>{new Date(r.created_at).toLocaleDateString()}</td><td style={{textAlign:"right"}}>{fmtMoney(r.outstanding)}</td>
        </tr>))}
        {rows.length===0 && <tr><td colSpan={6} className="small">No orders</td></tr>}
      </tbody></table>
  </div>);
}
