"use client";
import { useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";

export default function NewFromMessage() {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<any | null>(null);
  const [code, setCode] = useState("");

  const parse = async () => {
    setParsed(null);
    const r = await fetch(`${API}/v1/parse`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ text, matcher: "ai", lang: "ms" })
    });
    const d = await r.json();
    setParsed(d);
    if (d?.code) setCode(d.code);
  };

  const create = async () => {
    if (!parsed) return;
    const body = {
      code: parsed.code,
      type: parsed.type,
      customer: {
        name: parsed.customer_name,
        phone: parsed.customer_phone,
        address: parsed.customer_address
      },
      items: parsed.items || [],
      delivery: parsed.delivery || { outbound_fee: 0, return_fee: 0, prepaid_outbound: true, prepaid_return: false },
      plan_months: parsed.plan_months,
      plan_monthly_amount: parsed.monthly_amount,
      schedule: parsed.schedule
    };
    const r = await fetch(`${API}/v1/orders`, {
      method: "POST",
      headers: {"Content-Type":"application/json", "Idempotency-Key": crypto.randomUUID()},
      body: JSON.stringify(body)
    });
    if (r.ok) window.location.href = `/orders/${body.code}`;
    else alert("Failed to create order");
  };

  return (
    <div>
      <h1>Create Order from Message</h1>
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={12} style={{width:"100%"}} placeholder="Paste WhatsApp message here..." />
      <div style={{marginTop:8}}>
        <button onClick={parse}>Parse</button>
      </div>
      {parsed && (
        <div style={{marginTop:16}}>
          <pre style={{background:"#f5f5f5", padding:12}}>{JSON.stringify(parsed, null, 2)}</pre>
          <button onClick={create}>Create Order</button>
        </div>
      )}
    </div>
  );
}
