"use client";
import { useEffect, useState } from "react";
import { API, postJSON, getJSON } from "../api";

type Toast = { kind: "ok" | "err" | "info"; msg: string };

export default function Ops() {
  const [code, setCode] = useState<string>(""); const [amount, setAmount] = useState<string>(""); const [toast, setToast] = useState<Toast | null>(null);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "?") { e.preventDefault(); note("info", "Shortcuts: C=Collect • R=Return • I=Cancel Instalment • B=Buyback • P=Payment • X=Export • /=Search Code"); }
      else if (e.key === "/" && !e.metaKey && !e.ctrlKey) { (document.getElementById("orderCode") as HTMLInputElement | null)?.focus(); e.preventDefault(); }
      else if (e.key.toLowerCase() === "p") { (document.getElementById("paymentBtn") as HTMLButtonElement)?.click(); }
      else if (e.key.toLowerCase() === "r") { (document.getElementById("returnBtn") as HTMLButtonElement)?.click(); }
      else if (e.key.toLowerCase() === "c") { (document.getElementById("collectBtn") as HTMLButtonElement)?.click(); }
      else if (e.key.toLowerCase() === "i") { (document.getElementById("cancelBtn") as HTMLButtonElement)?.click(); }
      else if (e.key.toLowerCase() === "b") { (document.getElementById("buybackBtn") as HTMLButtonElement)?.click(); }
      else if (e.key.toLowerCase() === "x") { window.location.href = "/export"; }
    } window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [code, amount]);
  function note(kind: Toast["kind"], msg: string) { setToast({ kind, msg }); setTimeout(() => setToast(null), 2500); }
  async function sendEvent(kind: "COLLECT" | "RETURN" | "INSTALMENT_CANCEL" | "BUYBACK") {
    if (!code.trim()) { note("err", "Enter order code first"); return; }
    try {
      const payload: any = { type: kind };
      if (kind === "INSTALMENT_CANCEL" && amount) payload.penalty_amount = parseFloat(amount);
      if (kind === "BUYBACK" && amount) payload.buyback_amount = parseFloat(amount);
      await postJSON(API(`/orders/${encodeURIComponent(code)}/event`), payload);
      note("ok", `${kind} submitted`);
    } catch (e: any) { note("err", e?.message ?? "Failed"); }
  }
  async function sendPayment() {
    if (!code.trim()) { note("err", "Enter order code first"); return; }
    const value = parseFloat(amount || "0"); if (!isFinite(value) || value <= 0) { note("err", "Enter a valid amount"); return; }
    try { await postJSON(API(`/orders/${encodeURIComponent(code)}/payments`), { amount: value }); setAmount(""); note("ok", "Payment recorded"); }
    catch (e: any) { note("err", e?.message ?? "Failed"); }
  }
  async function invoice(){ if(!code.trim()) return note("err","Enter code"); try{ const r=await getJSON<{url:string}>(API(`/orders/${encodeURIComponent(code)}/invoice.pdf`)); window.open(r.url,"_blank"); }catch(e:any){ note("err", e?.message ?? "Failed"); } }
  async function receipt(){ if(!code.trim()) return note("err","Enter code"); const v=amount||prompt("Amount (RM)")||""; if(!v) return; try{ await postJSON(API(`/orders/${encodeURIComponent(code)}/payments`), { amount: parseFloat(v) }); const r=await getJSON<{url:string}>(API(`/orders/${encodeURIComponent(code)}/receipt.pdf?amount=${encodeURIComponent(v)}`)); window.open(r.url,"_blank"); setAmount(""); note("ok","Recorded & opened receipt"); }catch(e:any){ note("err", e?.message ?? "Failed"); } }
  return (<>
    <div className="grid cols-2">
      <div className="card stack">
        <div className="row"><div className="title" style={{ flex: 1 }}>Search Order</div><kbd className="kbd">/</kbd></div>
        <input id="orderCode" className="input" placeholder="Enter order code (e.g., ORD-202508-0001)" value={code} onChange={e => setCode(e.target.value)} />
      </div>
      <div className="card stack">
        <div className="row"><div className="title" style={{ flex: 1 }}>Payment</div><span className="badge">P</span></div>
        <div className="row"><input className="input" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
          <button id="paymentBtn" className="btn primary" onClick={sendPayment}>Record Payment</button></div>
        <div className="row"><button className="btn" onClick={invoice}>Invoice</button><button className="btn" onClick={receipt}>Receipt</button></div>
      </div>
      <div className="card stack"><div className="row"><div className="title" style={{ flex: 1 }}>Return</div><span className="badge">R</span></div>
        <div className="sub">Mark items returned.</div><button id="returnBtn" className="btn" onClick={() => sendEvent("RETURN")}>Mark Return</button></div>
      <div className="card stack"><div className="row"><div className="title" style={{ flex: 1 }}>Collect</div><span className="badge">C</span></div>
        <div className="sub">Mark items collected.</div><button id="collectBtn" className="btn" onClick={() => sendEvent("COLLECT")}>Mark Collect</button></div>
      <div className="card stack"><div className="row"><div className="title" style={{ flex: 1 }}>Cancel Instalment</div><span className="badge">I</span></div>
        <div className="sub">Settle penalties and close plan.</div><button id="cancelBtn" className="btn warn" onClick={() => sendEvent("INSTALMENT_CANCEL")}>Cancel Instalment</button></div>
      <div className="card stack"><div className="row"><div className="title" style={{ flex: 1 }}>Buyback Outright</div><span className="badge">B</span></div>
        <div className="sub">Buy back items and adjust ledger.</div><button id="buybackBtn" className="btn" onClick={() => sendEvent("BUYBACK")}>Buyback</button></div>
    </div>
    {toast && <div className="toast">{toast.msg}</div>}
  </>);
}
