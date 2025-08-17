"use client";
import { useEffect, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";

export default function OrderDetail({ params }: any) {
  const { code } = params;
  const [data, setData] = useState<any | null>(null);
  const [amount, setAmount] = useState<string>("");

  const load = async () => {
    const r = await fetch(`${API}/v1/orders/${code}`);
    const d = await r.json();
    setData(d);
  };

  useEffect(() => { load(); }, [code]);

  const pay = async () => {
    const r = await fetch(`${API}/v1/orders/${code}/payments`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ amount: parseFloat(amount), method:"CASH" })
    });
    if (r.ok) load();
    else alert("Payment failed");
  };

  if (!data) return <div>Loading...</div>;
  const o = data;

  return (
    <div>
      <h1>Order {o.order.code}</h1>
      <div>Type: {o.meta.type} | Status: {o.meta.status}</div>
      <div>Customer: {o.meta.customer_name} ({o.meta.phone})</div>

      <h3>Items</h3>
      <ul>{o.items.map((i: any) => <li key={i.id}>{i.qty} x {i.name} — RM {i.unit_price}</li>)}</ul>

      <h3>Payments</h3>
      <ul>{o.payments.map((p: any) => <li key={p.id}>RM {p.amount} on {p.created_at}</li>)}</ul>

      <div style={{marginTop:8}}>
        <input placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button onClick={pay}>Add Payment</button>
      </div>

      <h3>Outstanding</h3>
      <pre style={{background:"#f5f5f5", padding:12}}>{JSON.stringify(o.summary, null, 2)}</pre>

      <div style={{marginTop:16}}>
        <a href={`${API}/v1/export/xlsx`} target="_blank" rel="noreferrer">Export XLSX</a>
      </div>
    </div>
  );
}
