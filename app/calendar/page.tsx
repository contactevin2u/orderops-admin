"use client";
import { useEffect, useState } from "react";
import { getJSON } from "../../lib/api";

type CalRow = { order_code:string; date:string; time?:string|null; kind:"OUTBOUND"|"RETURN"; status:string };

export default function Calendar(){
  const [rows,setRows] = useState<CalRow[]>([]);
  useEffect(()=>{
    getJSON<{events:CalRow[]}>("/calendar").then(r=>setRows(r.events||[]));
  },[]);
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Calendar</h1>
      <div className="border rounded">
        <table className="w-full">
          <thead><tr className="text-left text-sm text-gray-500"><th className="p-2">Date</th><th>Time</th><th>Kind</th><th>Order</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} className="border-t">
                <td className="p-2">{r.date}</td><td>{r.time||"-"}</td><td>{r.kind}</td><td>{r.order_code}</td><td>{r.status}</td>
              </tr>
            ))}
            {rows.length===0 && <tr><td className="p-3 text-gray-500" colSpan={5}>No events.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
