"use client";
import { useEffect, useState } from "react";
import { API, postJSON, uuid } from "../lib/api";
import { Toast } from "./components/Toast";
import { ItemsEditor, Item } from "./components/ItemsEditor";
import { SummaryRow } from "./components/Summary";

type Parsed = {
  order_code?: string|null;
  customer_name?: string|null;
  phone?: string|null;
  address?: string|null;
  delivery?: { outbound_fee?:number|null, return_fee?:number|null };
  totals?: { total?:number|null, paid?:number|null, balance?:number|null };
  schedule?: { date?:string|null, time?:string|null };
  plan?: { months?: number|null, start_date?: string|null };
  type_hint?: "RENTAL"|"OUTRIGHT"|null;
  items?: Item[];
};
export default function Intake(){
  const [text,setText]=useState("");
  const [parsed,setParsed]=useState<Parsed|nul
l>(null);
  const [items,setItems]=useState<Item[]>([]);
  const [type,setType]=useState<"RENTAL"|"INSTALMENT"|"OUTRIGHT">("RENTAL");
  const [code,setCode]=useState("");
  const [customer,setCustomer]=useState({name:"",phone:"",address:""});
  const [fees,setFees]=useState({outbound_fee:0, return_fee:0, prepaid_outbound:true, prepaid_return:false});
  const [schedule,setSchedule]=useState<{date?:string|null, time?:string|null}>({});
  const [plan,setPlan]=useState<{months?:number|null, start_date?:string|null}>({});
  const [toast,setToast]=useState<{kind:"ok"|"err"|"info",msg:string}|null>(null);

  useEffect(()=>{ const onKey=(e:KeyboardEvent)=>{ if(e.key==="/"){ e.preventDefault(); (document.getElementById("paste") as HTMLTextAreaElement)?.focus(); } }; window.addEventListener("keydown", onKey); return()=>window.removeEventListener("keydown", onKey);},[]);

  async function parse(){
    try{
      const res = await postJSON<{parsed:any,match?:any,intent?:string,hints?:any}>("/parse",{ text, matcher:"ai", lang:"ms" });
      const p: Parsed = res.parsed || {};
      setParsed(p);
      setItems(p.items||[]);
      setCode(p.order_code||"");
      setCustomer({name:p.customer_name||"", phone:p.phone||"", address:p.address||""});
      setFees({outbound_fee:p.delivery?.outbound_fee||0, return_fee:p.delivery?.return_fee||0, prepaid_outbound:true, prepaid_return:false});
      setSchedule({date:p.schedule?.date||null, time:p.schedule?.time||null});
      setPlan({months:p.plan?.months||null, start_date:p.plan?.start_date||null});
      if(p.type_hint==="OUTRIGHT") setType("OUTRIGHT"); else setType("RENTAL");
      setToast({kind:"ok",msg:"Parsed"});
    }catch(e:any){
      setToast({kind:"err",msg:e?.message||"Parse failed"});
    }
  }

  async function create(){
    if(!code.trim()) { setToast({kind:"err",msg:"Order code required"}); return; }
    if(!customer.name.trim()) { setToast({kind:"err",msg:"Customer name required"}); return; }
    const body = {
      code, type,
      customer, items,
      plan: { months: plan.months || null, start_date: plan.start_date || null },
      delivery: { outbound_fee: fees.outbound_fee, return_fee: fees.return_fee, prepaid_outbound: fees.prepaid_outbound, prepaid_return: fees.prepaid_return },
      schedule: schedule
    };
    try{
      await fetch(API("/orders"), {
        method:"POST",
        headers:{"Content-Type":"application/json","Idempotency-Key": uuid()},
        body: JSON.stringify(body)
      }).then(async r=>{ if(!r.ok) throw new Error(await r.text()); return r.json();});
      setToast({kind:"ok",msg:"Order created"});
    }catch(e:any){
      setToast({kind:"err",msg:e?.message||"Create failed"});
    }
  }

  return (
    <div className="stack">
      <div className="title">Intake (AI)</div>
      <div className="card stack">
        <textarea id="paste" className="input" placeholder="Paste WhatsApp order…" rows={10} value={text} onChange={e=>setText(e.target.value)} />
        <div className="row"><button className="btn btn-primary" onClick={parse}>Parse</button></div>
      </div>

      <div className="card stack">
        <div className="row" style={{gap:16}}>
          <label style={{flex:1}}>Order Code<input className="input" value={code} onChange={e=>setCode(e.target.value)} /></label>
          <label style={{width:220}}>Type
            <select className="input" value={type} onChange={e=>setType(e.target.value as any)}>
              <option value="RENTAL">RENTAL</option>
              <option value="INSTALMENT">INSTALMENT</option>
              <option value="OUTRIGHT">OUTRIGHT</option>
            </select>
          </label>
        </div>
        <div className="col2">
          <label>Customer Name<input className="input" value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/></label>
          <label>Phone<input className="input" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})}/></label>
          <label style={{gridColumn:"1 / -1"}}>Address<textarea className="input" rows={3} value={customer.address} onChange={e=>setCustomer({...customer,address:e.target.value})}/></label>
        </div>
        <div className="col2">
          <label>Delivery Date<input className="input" type="date" value={schedule.date||""} onChange={e=>setSchedule({...schedule, date:e.target.value||null})}/></label>
          <label>Delivery Time<input className="input" placeholder="HH:MM" value={schedule.time||""} onChange={e=>setSchedule({...schedule, time:e.target.value||null})}/></label>
          <label>Plan Months<input className="input" type="number" min="0" value={plan.months??""} onChange={e=>setPlan({...plan, months:e.target.value===""?null:parseInt(e.target.value)})}/></label>
          <label>Plan Start<input className="input" type="date" value={plan.start_date||""} onChange={e=>setPlan({...plan, start_date:e.target.value||null})}/></label>
        </div>
        <div className="row">
          <label>Outbound Fee (RM)<input className="input" type="number" step="0.01" style={{width:140}} value={fees.outbound_fee} onChange={e=>setFees({...fees, outbound_fee:parseFloat(e.target.value||"0")})}/></label>
          <label>Return Fee (RM)<input className="input" type="number" step="0.01" style={{width:140}} value={fees.return_fee} onChange={e=>setFees({...fees, return_fee:parseFloat(e.target.value||"0")})}/></label>
          <label className="row"><input type="checkbox" checked={fees.prepaid_outbound} onChange={e=>setFees({...fees, prepaid_outbound:e.target.checked})}/> <span>Prepaid Outbound</span></label>
          <label className="row"><input type="checkbox" checked={fees.prepaid_return} onChange={e=>setFees({...fees, prepaid_return:e.target.checked})}/> <span>Prepaid Return</span></label>
        </div>

        <div className="title">Items</div>
        <ItemsEditor value={items} onChange={setItems} />

        <div className="row" style={{justifyContent:"space-between"}}>
          <div className="row" style={{gap:12,color:"#94a3b8"}}>
            <span><span className="kbd">/</span> focus paste</span>
          </div>
          <button className="btn btn-primary" onClick={create}>Create Order</button>
        </div>
      </div>

      {parsed && (
        <div className="card">
          <div className="title">Parsed Summary</div>
          <div className="stack">
            <SummaryRow label="Type Hint" value={parsed.type_hint||"—"} />
            <SummaryRow label="Schedule" value={(parsed.schedule?.date||"—")+" "+(parsed.schedule?.time||"")} />
            <SummaryRow label="Plan" value={(parsed.plan?.months?parsed.plan?.months+" m":"—")+" start "+(parsed.plan?.start_date||"—")} />
            <SummaryRow label="Delivery Fees" value={`Out RM${parsed.delivery?.outbound_fee??0} / Return RM${parsed.delivery?.return_fee??0}`} />
          </div>
        </div>
      )}

      {toast && <Toast kind={toast.kind} msg={toast.msg} onClose={()=>setToast(null)} />}
    </div>
  );
}
