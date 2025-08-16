"use client";
import { useEffect, useState } from "react";
import { getJSON } from "../../lib/api";

type Row = { code:string; customer:string; type:string; age_days:number; outstanding:number };

export default function Aging(){
  const [buckets,setBuckets] = useState<{[k:string]:number}>({});
  const [rows,setRows] = useState<Row[]>([]);
  useEffect(()=>{
    getJSON<{as_of:string; buckets:any; rows:Row[]}>("/reports/aging").then(r=>{
      setBuckets(r.buckets||{}); setRows(r.rows||[]);
    });
  },[]);
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Aging</h1>
      <div className="grid grid-cols-4 gap-3">
        {["0-30","31-60","61-90","90+"].map(k=>
          <div key={k} className="border rounded p-3">
            <div className="text-gray-500">{k} days</div>
            <div className="text-xl font-semibold">RM {(buckets[k]||0).toFixed(2)}</div>
          </div>
        )}
      </div>
      <div className="border rounded">
        <table className="w-full">
          <thead><tr className="text-left text-sm text-gray-500"><th className="p-2">Code</th><th>Customer</th><th>Type</th><th>Age</th><th>Outstanding</th></tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.code} className="border-t">
                <td className="p-2">{r.code}</td><td>{r.customer}</td><td>{r.type}</td><td>{r.age_days}</td><td>RM {r.outstanding.toFixed(2)}</td>
              </tr>
            ))}
            {rows.length===0 && <tr><td colSpan={5} className="p-3 text-gray-500">No rows.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
