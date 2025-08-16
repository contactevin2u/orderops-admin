"use client";
import { useState } from "react";
import type { Item } from "../../lib/types";

export function ItemsEditor({ value, onChange }:{ value: Item[]; onChange: (v: Item[])=>void }) {
  const [draft, setDraft] = useState<Item>({ sku:"", name:"", qty:1, unit_price:null, rent_monthly:null, buyback_rate:null });

  function addItem(){
    if(!draft.name.trim()) return;
    onChange([...value, {...draft, qty: Math.max(1, Number(draft.qty||1)) }]);
    setDraft({ sku:"", name:"", qty:1, unit_price:null, rent_monthly:null, buyback_rate:null });
  }
  function rm(i:number){
    const nv = value.slice(); nv.splice(i,1); onChange(nv);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-2">
        <input className="border p-2 rounded" placeholder="SKU" value={draft.sku} onChange={e=>setDraft({...draft, sku:e.target.value})}/>
        <input className="border p-2 rounded col-span-2" placeholder="Item name" value={draft.name} onChange={e=>setDraft({...draft, name:e.target.value})}/>
        <input className="border p-2 rounded" type="number" min={1} placeholder="Qty" value={draft.qty} onChange={e=>setDraft({...draft, qty:Number(e.target.value)})}/>
        <input className="border p-2 rounded" type="number" step="0.01" placeholder="Unit Price" value={draft.unit_price??""} onChange={e=>setDraft({...draft, unit_price:e.target.value===""?null:Number(e.target.value)})}/>
        <input className="border p-2 rounded" type="number" step="0.01" placeholder="Rent Monthly" value={draft.rent_monthly??""} onChange={e=>setDraft({...draft, rent_monthly:e.target.value===""?null:Number(e.target.value)})}/>
      </div>
      <div className="flex gap-2 items-center">
        <input className="border p-2 rounded w-40" type="number" step="0.01" placeholder="Buyback Rate (0..1)" value={draft.buyback_rate??""} onChange={e=>setDraft({...draft, buyback_rate:e.target.value===""?null:Number(e.target.value)})}/>
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={addItem}>Add Item</button>
      </div>
      <div className="border rounded">
        {value.length===0 ? <div className="p-3 text-gray-500">No items yet.</div> :
        <table className="w-full">
          <thead><tr className="text-left text-sm text-gray-500">
            <th className="p-2">SKU</th><th>Name</th><th>Qty</th><th>Unit</th><th>Rent/mo</th><th></th>
          </tr></thead>
          <tbody>
            {value.map((it,i)=>(
              <tr key={i} className="border-t">
                <td className="p-2">{it.sku}</td>
                <td>{it.name}</td>
                <td>{it.qty}</td>
                <td>{it.unit_price??"-"}</td>
                <td>{it.rent_monthly??"-"}</td>
                <td className="text-right p-2"><button className="text-red-600" onClick={()=>rm(i)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    </div>
  );
}
