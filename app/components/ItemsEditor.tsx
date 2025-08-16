"use client";
import { useState } from "react";

export type Item = { sku?:string; name:string; qty:number; unit_price?:number|null; rent_monthly?:number|null; buyback_rate?:number|null; };
export function ItemsEditor({value,onChange}:{value:Item[]; onChange:(v:Item[])=>void}){
  const [name,setName]=useState(""); const [qty,setQty]=useState(1); const [rate,setRate]=useState<number|null>(null); const [rent,setRent]=useState<number|null>(null);
  function add(){ if(!name.trim()) return; onChange([...value,{name,qty,unit_price:rate,rent_monthly:rent}]); setName(""); setQty(1); setRate(null); setRent(null);}
  function set(i:number, patch:Partial<Item>){ const next=[...value]; next[i] = {...next[i], ...patch}; onChange(next); }
  function del(i:number){ const next=[...value]; next.splice(i,1); onChange(next); }
  return (
    <div className="stack">
      <div className="row">
        <input className="input" placeholder="Item name" value={name} onChange={e=>setName(e.target.value)} style={{flex:2}}/>
        <input className="input" type="number" min={1} value={qty} onChange={e=>setQty(parseInt(e.target.value||"1"))} style={{width:100}}/>
        <input className="input" type="number" step="0.01" placeholder="Unit Price (sale/instalment)" value={rate??""} onChange={e=>setRate(e.target.value===""?null:parseFloat(e.target.value))}/>
        <input className="input" type="number" step="0.01" placeholder="Rent Monthly" value={rent??""} onChange={e=>setRent(e.target.value===""?null:parseFloat(e.target.value))}/>
        <button className="btn btn-primary" onClick={add}>Add</button>
      </div>
      <table className="table"><thead><tr><th>SKU</th><th>Item</th><th>Qty</th><th>Unit Price</th><th>Rent Monthly</th><th></th></tr></thead>
        <tbody>
        {value.length===0 && <tr><td colSpan={6} style={{color:"#94a3b8"}}>No items.</td></tr>}
        {value.map((it,i)=>(
          <tr key={i}>
            <td style={{width:140}}><input className="input" value={it.sku||""} onChange={e=>set(i,{sku:e.target.value})}/></td>
            <td><input className="input" value={it.name} onChange={e=>set(i,{name:e.target.value})}/></td>
            <td style={{width:100}}><input className="input" type="number" min={1} value={it.qty} onChange={e=>set(i,{qty:parseInt(e.target.value||"1")})}/></td>
            <td style={{width:160}}><input className="input" type="number" step="0.01" value={it.unit_price??""} onChange={e=>set(i,{unit_price:e.target.value===""?null:parseFloat(e.target.value)})}/></td>
            <td style={{width:160}}><input className="input" type="number" step="0.01" value={it.rent_monthly??""} onChange={e=>set(i,{rent_monthly:e.target.value===""?null:parseFloat(e.target.value)})}/></td>
            <td style={{width:80}}><button className="btn" onClick={()=>del(i)}>Delete</button></td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
