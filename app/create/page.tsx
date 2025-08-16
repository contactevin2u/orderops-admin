"use client";
import { useState } from "react";
import type { OrderCreate, Item } from "../../lib/types";
import { postJSON, uuid } from "../../lib/api";
import { ItemsEditor } from "../components/ItemsEditor";
import { Toast, ToastView } from "../components/Toast";

export default function Create() {
  const [code,setCode] = useState("");
  const [type,setType] = useState<"RENTAL"|"INSTALMENT"|"OUTRIGHT">("RENTAL");
  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [address,setAddress] = useState("");
  const [items,setItems] = useState<Item[]>([]);
  const [outboundFee,setOutboundFee] = useState(0);
  const [returnFee,setReturnFee] = useState(0);
  const [toast,setToast] = useState<Toast|null>(null);

  async function submit(){
    const finalCode = code.trim() || ("OS-"+uuid().slice(-6));
    if(!name.trim()) { setToast({kind:"err", msg:"Customer name required"}); return; }
    if(items.length===0) { setToast({kind:"err", msg:"Add items"}); return; }
    const body: OrderCreate = {
      code: finalCode,
      type,
      customer: { name, phone, address },
      items,
      plan: null, schedule: null,
      delivery: { outbound_fee: outboundFee, return_fee: returnFee, prepaid_outbound: true, prepaid_return: false }
    };
    try{
      await postJSON("/orders", body);
      setToast({kind:"ok", msg:`Created ${finalCode}`});
      setCode(finalCode);
    }catch(e:any){ setToast({kind:"err", msg:e?.message ?? "Create failed"}); }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Create Order</h1>
      <div className="grid grid-cols-2 gap-2">
        <input className="border p-2 rounded" placeholder="Code (optional)" value={code} onChange={e=>setCode(e.target.value)} />
        <select className="border p-2 rounded" value={type} onChange={e=>setType(e.target.value as any)}>
          <option value="RENTAL">RENTAL</option>
          <option value="INSTALMENT">INSTALMENT</option>
          <option value="OUTRIGHT">OUTRIGHT</option>
        </select>
        <input className="border p-2 rounded col-span-2" placeholder="Customer Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input className="border p-2 rounded" type="number" step="0.01" placeholder="Outbound Fee" value={outboundFee} onChange={e=>setOutboundFee(Number(e.target.value||0))}/>
        <input className="border p-2 rounded" type="number" step="0.01" placeholder="Return Fee" value={returnFee} onChange={e=>setReturnFee(Number(e.target.value||0))}/>
      </div>
      <ItemsEditor value={items} onChange={setItems} />
      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={submit}>Create</button>
      <ToastView toast={toast} onDone={()=>setToast(null)} />
    </div>
  );
}
