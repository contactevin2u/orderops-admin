"use client";
import { useEffect, useState } from "react";
import { API, getJSON, postJSON, fmtMoney } from "../../api";
export default function OrderDetail({ params }:{ params:{ code: string } }){
  const code = decodeURIComponent(params.code);
  const [data,setData]=useState<any>(null); const [err,setErr]=useState<string>(""); const [penalty,setPenalty]=useState<string>(""); const [retFee,setRetFee]=useState<string>(""); const [buybackAmount,setBuybackAmount]=useState<string>("");
  async function load(){ try{ setData(await getJSON(API(`/orders/${encodeURIComponent(code)}`))); }catch(e:any){ setErr(e?.message ?? "Failed to load"); } }
  useEffect(()=>{ load(); },[code]);
  async function action(kind:"RETURN"|"COLLECT"|"INSTALMENT_CANCEL"|"BUYBACK"){ const body:any={type:kind}; if(kind==="INSTALMENT_CANCEL"){ const p=parseFloat(penalty||"0"); if(p>0) body.penalty_amount=p; const d=parseFloat(retFee||"0"); if(d>0) body.delivery_fee = d; } if(kind==="BUYBACK"){ const b=parseFloat(buybackAmount||"0"); if(b>0) body.buyback_amount=b; } await postJSON(API(`/orders/${encodeURIComponent(code)}/event`), body); await load(); alert(kind+" submitted"); }
  async function pay(){ const v=prompt("Payment amount (RM)"); if(!v) return; const a=parseFloat(v); if(!(isFinite(a) && a>0)) return alert("Invalid"); await postJSON(API(`/orders/${encodeURIComponent(code)}/payments`), { amount:a }); await load(); }
  if(err) return <div className="err">{err}</div>;
  if(!data) return <div>Loading...</div>;
  const ord = data.order; const cust = data.customer; const items = data.items||[]; const pays=data.payments||[]; const led=data.ledger||[]; const sum=data.charges||{};
  return (<div className="stack">
    <div className="row"><div className="title" style={{flex:1}}>Order #{code} <span className="badge">{ord.type}</span> <span className="badge">{ord.status}</span></div>
      <a className="btn" href={API(`/orders/${encodeURIComponent(code)}/invoice.pdf`)} target="_blank">Invoice</a>
      <button className="btn" onClick={pay}>Record Payment</button>
    </div>
    <div className="grid cols-2">
      <div className="card stack"><div className="title">Customer</div>
        <div><b>{cust.name}</b></div><div>{cust.phone}</div><div style={{whiteSpace:"pre-line"}}>{cust.address}</div>
      </div>
      <div className="card stack"><div className="title">Summary</div>
        <div>Initial: {fmtMoney(sum.initial||0)}</div><div>Monthly: {fmtMoney(sum.monthly||0)}</div><div>Paid: {fmtMoney(sum.paid||0)}</div><div><b>Outstanding: {fmtMoney(sum.outstanding||0)}</b></div>
      </div>
    </div>
    <div className="card stack"><div className="title">Items</div>
      <table><thead><tr><th>SKU</th><th>Name</th><th>Qty</th><th>Unit</th></tr></thead><tbody>
        {items.map((i:any)=>(<tr key={i.sku}><td>{i.sku}</td><td>{i.name}</td><td>{i.qty}</td><td style={{textAlign:"right"}}>{fmtMoney((i.unit_price ?? 0))}</td></tr>))}
        {items.length===0 && <tr><td colSpan={4} className="small">No items.</td></tr>}
      </tbody></table>
    </div>
    <div className="grid cols-2">
      <div className="card stack"><div className="title">Ledger</div>
        <table><thead><tr><th>Kind</th><th>Period</th><th>Note</th><th style={{textAlign:"right"}}>Amount</th></tr></thead><tbody>
          {led.map((l:any)=>(<tr key={l.id}><td>{l.kind}</td><td>{l.period||"-"}</td><td>{l.note||""}</td><td style={{textAlign:"right"}}>{fmtMoney(l.amount)}</td></tr>))}
          {led.length===0 && <tr><td colSpan={4} className="small">No ledger.</td></tr>}
        </tbody></table>
      </div>
      <div className="card stack"><div className="title">Payments</div>
        <table><thead><tr><th>ID</th><th>Date</th><th>Method</th><th style={{textAlign:"right"}}>Amount</th></tr></thead><tbody>
          {pays.map((p:any)=>(<tr key={p.id}><td>{p.id}</td><td>{new Date(p.created_at).toLocaleString()}</td><td>{p.method}</td><td style={{textAlign:"right"}}>{fmtMoney(p.amount)}</td></tr>))}
          {pays.length===0 && <tr><td colSpan={4} className="small">No payments.</td></tr>}
        </tbody></table>
      </div>
    </div>
    <div className="card stack"><div className="title">Quick Actions</div>
      <div className="row"><button className="btn" onClick={()=>action("COLLECT")}>Mark Collect</button><button className="btn" onClick={()=>action("RETURN")}>Mark Return</button></div>
      <div className="row"><input className="input" placeholder="Penalty (RM)" value={penalty} onChange={e=>setPenalty(e.target.value)} style={{maxWidth:180}}/>
        <input className="input" placeholder="Return Delivery Fee (RM)" value={retFee} onChange={e=>setRetFee(e.target.value)} style={{maxWidth:220}}/>
        <button className="btn warn" onClick={()=>action("INSTALMENT_CANCEL")}>Cancel Instalment</button></div>
      <div className="row"><input className="input" placeholder="Buyback Amount (RM)" value={buybackAmount} onChange={e=>setBuybackAmount(e.target.value)} style={{maxWidth:220}}/>
        <button className="btn" onClick={()=>action("BUYBACK")}>Buyback</button></div>
    </div>
  </div>);
}
