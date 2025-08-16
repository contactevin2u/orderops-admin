"use client";
import { useEffect, useState } from "react";
import { API, postJSON } from "./api";
type Parsed = { parsed?: any; match?: any; intent?: string };
export default function Intake() {
  const [raw, setRaw] = useState<string>(""); const [res, setRes] = useState<Parsed | null>(null); const [err, setErr] = useState<string>("");
  const [matcher, setMatcher] = useState<string>("hybrid"); const [lang, setLang] = useState<"en"|"ms">("en");
  useEffect(()=>{ function onKey(e:KeyboardEvent){ if(e.key==="/"){ e.preventDefault(); (document.getElementById("raw") as HTMLTextAreaElement|null)?.focus(); } } window.addEventListener("keydown",onKey); return()=>window.removeEventListener("keydown",onKey);},[]);
  async function parse(){ setErr(""); try{ const data = await postJSON<Parsed>(API("/parse"), { raw, fast: true, lenient: true, matcher }); setRes(data);} catch(e:any){ setErr(e?.message ?? "Failed to parse"); } }
  async function createOrder(){ const code = (res?.match as any)?.order_code || window.prompt("Enter new order code"); if(!code) return; alert("Use /orders page to create with full details in this build."); }
  async function applyIntent(){ const code = (res?.match as any)?.order_code; const intent = (res as any)?.intent; if(!code || !intent){ alert("Need order code & intent"); return; } try{ await postJSON(API(`/orders/${encodeURIComponent(code)}/event`), { type:intent }); alert(`Applied ${intent} to ${code}`); }catch(e:any){ alert(e?.message ?? "Failed"); } }
  const t=(en:string,ms:string)=>lang==="en"?en:ms;
  return (<div className="grid cols-2">
    <section className="card stack"><div className="row">
      <div><div className="title">{t("Fast Intake","Intake Pantas")}</div><div className="small">{t("Paste SMS/WhatsApp and hit Parse","Tampal SMS/WhatsApp dan tekan Parse")}</div></div>
      <select className="input" style={{maxWidth:140}} value={matcher} onChange={e=>setMatcher(e.target.value)}><option value="hybrid">hybrid</option><option value="rf">rapidfuzz</option><option value="vector">vector</option></select>
      <select className="input" style={{maxWidth:120}} value={lang} onChange={e=>setLang(e.target.value as any)}><option value="en">EN</option><option value="ms">MS</option></select>
      <button className="btn primary" onClick={parse}>Parse</button></div>
      <textarea id="raw" className="input" rows={12} placeholder={t("Paste message and click Parse.","Tampal mesej dan klik Parse.")} value={raw} onChange={e=>setRaw(e.target.value)} />
      {err && <div className="err">{err}</div>}
      <div className="row"><button className="btn" onClick={createOrder}>Create Order</button>{(res as any)?.intent && <button className="btn" onClick={applyIntent}>Apply Intent {(res as any)?.intent}</button>}</div>
    </section>
    <section className="card stack"><div className="title">Result</div>
      {!res && <div className="small">No result yet.</div>}
      {res && (<>
        <div className="row"><span className="badge">Parsed</span>{(res as any)?.match?.order_code && <span className="badge">#{(res as any).match.order_code}</span>}{(res as any)?.intent && <span className="badge">{(res as any).intent}</span>}</div>
        <pre style={{ background:"#0e0e10", padding:12, borderRadius:12, overflow:"auto", maxHeight:380 }}>{JSON.stringify(res, null, 2)}</pre>
      </>)}
    </section></div>);
}
