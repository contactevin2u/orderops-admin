"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";

export default function Home() {
  const [orders, setOrders] = useState<any[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch(`${API}/v1/orders`)
      .then(r => r.json()).then(d => setOrders(d.orders || []))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      <div style={{marginBottom:12}}>
        <a href="/orders/new">Create from Message</a>
      </div>
      <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} />
      <ul>
        {orders.filter(o => !q || (o.code?.toLowerCase().includes(q.toLowerCase()))).map((o) => (
          <li key={o.code}>
            <a href={`/orders/${o.code}`}>{o.code}</a> — {o.type} — {o.customer?.name} — RM {o.outstanding}
          </li>
        ))}
      </ul>
    </div>
  );
}
