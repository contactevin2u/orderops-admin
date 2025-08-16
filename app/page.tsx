"use client";
import { useEffect, useState } from "react";
import { API, postJSON, uuid } from "../lib/api";
import type { Parsed, Match, Intent, OrderCreate, Item } from "../lib/types";
import { ItemsEditor } from "./components/ItemsEditor";
import { Toast, ToastView } from "./components/Toast";

export default function Intake(){
  const [text,setText] = useState("");
  const [parsed,setParsed] = useState<Parsed|null>(null);
  const [match,setMatch] = useState<Match|null>(null);
  const [intent,setIntent] = useState<Intent>(null);
  const [type,setType] = useState<"RENTAL"|"INSTALMENT"|"OUTRIGHT">("RENTAL");
  const [code,setCode] = useState<string>("");
  const [custName,setCustName] = useState("");
  const [phone,setPhone] = useState("");
  const [address,setAddress] = useState("");
  const [items,setItems] = useState<Item[]>([]);
  const [planMonths,setPlanMonths] = useState<number|undefined>(undefined);
  const [planMonthly,setPlanMonthly] = useState<number|undefined>(undefined);
  const [planStart,setPlanStart] = useState<string>("");
  const [outboundFee,setOutboundFee] = useState<number>(0);
  const [returnFee,setReturnFee] = useState<number>(0);
  const [preOut,setPreOut] = useState(true);
  const [preRet,setPreRet] = useState(false);
  const [schedDate,setSchedDate] = useState<string>("");
  const [schedTime,setSchedTime] = useState<string>("");
  const [toast,setToast] = useState<Toast|null>(null);

  async function parse(){
    try{
      const res = await postJSON<{parsed:Parsed; match:Match|null; intent:Intent}>("/parse", { text, matcher:"ai", lang:"en" });
      setParsed(res.parsed || null);
      setMatch(res.match || null);
      setIntent(res.intent || null);
      if (res.match?.order_code) setCode(res.match.order_code);
      if (res.parsed?.ai?.customer_name) setCustName(res.parsed.ai.customer_name);
      if (res.parsed?.ai?.phone) setPhone(res.parsed.ai.phone);
    }catch(e:any){
      setToast({kind:"err", msg:e?.message ?? "Parse failed"});
    }
  }

  async function create(){
    const finalCode = code.trim() || ("OS-"+uuid().slice(-6));
    if (!custName.trim()) { setToast({kind:"err", msg:"Customer name required"}); return; }
    if (items.length===0) { setToast({kind:"err", msg:"Add at least one item"}); return; }
    const body: OrderCreate = {
      code: finalCode,
      type,
      customer: { name: custName, phone, address },
      plan_months: planMonths,
      plan_monthly_amount: planMonthly,
      plan_start_date: planStart || null,
      plan: planMonths||planStart ? { months: planMonths, start_date: planStart||null } : null,
      schedule: (schedDate||schedTime) ? { date: schedDate||null, time: schedTime||null } : null,
      items,
      delivery: { outbound_fee:outboundFee, return_fee:returnFee, prepaid_outbound:preOut, prepaid_return:preRet }
    };
    try{
      await postJSON("/orders", body);
      setToast({kind:"ok", msg:`Created ${finalCode}`});
      setCode(finalCode);
    }catch(e:any){
      setToast({kind:"err", msg:e?.message ?? "Create failed"});
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Intake (AI)</h1>
      <div className="grid grid-cols-2 gap-4">
        <textarea className="border rounded p-3 min-h-48" placeholder="Paste WhatsApp/SMS…" value={text} onChange={e=>setText(e.target.value)} />
        <div className="space-y-3">
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-gray-700 text-white rounded" onClick={parse}>AI Parse</button>
            <select className="border rounded p-2" value={type} onChange={e=>setType(e.target.value as any)}>
              <option value="RENTAL">RENTAL</option>
              <option value="INSTALMENT">INSTALMENT</option>
              <option value="OUTRIGHT">OUTRIGHT</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input className="border p-2 rounded" placeholder="Order Code (optional)" value={code} onChange={e=>setCode(e.target.value)} />
            <input className="border p-2 rounded" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
            <input className="border p-2 rounded col-span-2" placeholder="Customer Name" value={custName} onChange={e=>setCustName(e.target.value)} />
            <textarea className="border p-2 rounded col-span-2" placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input className="border p-2 rounded" type="number" placeholder="Plan Months" value={planMonths??""} onChange={e=>setPlanMonths(e.target.value===""?undefined:Number(e.target.value))}/>
            <input className="border p-2 rounded" type="number" step="0.01" placeholder="Plan Monthly Amount" value={planMonthly??""} onChange={e=>setPlanMonthly(e.target.value===""?undefined:Number(e.target.value))}/>
            <input className="border p-2 rounded" type="date" placeholder="Plan Start" value={planStart} onChange={e=>setPlanStart(e.target.value)}/>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <input className="border p-2 rounded" type="date" value={schedDate} onChange={e=>setSchedDate(e.target.value)} />
            <input className="border p-2 rounded" type="time" value={schedTime} onChange={e=>setSchedTime(e.target.value)} />
            <input className="border p-2 rounded" type="number" step="0.01" placeholder="Outbound Fee" value={outboundFee} onChange={e=>setOutboundFee(Number(e.target.value||0))}/>
            <input className="border p-2 rounded" type="number" step="0.01" placeholder="Return Fee" value={returnFee} onChange={e=>setReturnFee(Number(e.target.value||0))}/>
            <label className="flex items-center gap-2"><input type="checkbox" checked={preOut} onChange={e=>setPreOut(e.target.checked)} /> Prepay Outbound</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={preRet} onChange={e=>setPreRet(e.target.checked)} /> Prepay Return</label>
          </div>

          <ItemsEditor value={items} onChange={setItems} />
          <div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={create}>Create Order</button>
          </div>
        </div>
      </div>
      <ToastView toast={toast} onDone={()=>setToast(null)} />
    </div>
  );
}
