"use client";
import { useState } from "react";
import { API } from "../api";
export default function ExportTab(){
  const [start,setStart]=useState<string>(""); const [end,setEnd]=useState<string>("");
  const [children,setChildren]=useState(true); const [adj,setAdj]=useState(true); const [unsettled,setUnsettled]=useState(false);
  function download(){ const p=new URLSearchParams(); if(start) p.set("start",start); if(end) p.set("end",end); p.set("include_children",String(children)); p.set("include_adjustments",String(adj)); p.set("only_unsettled",String(unsettled)); window.location.href = API(`/export/csv?${p.toString()}`); }
  return (<div className="stack"><div className="title">CSV Export</div><div className="row">
    <label>From<input aria-label="From date" type="date" className="input" value={start} onChange={e=>setStart(e.target.value)} /></label>
    <label>To<input aria-label="To date" type="date" className="input" value={end} onChange={e=>setEnd(e.target.value)} /></label>
    <label className="row"><input type="checkbox" checked={children} onChange={e=>setChildren(e.target.checked)} /> Include child orders</label>
    <label className="row"><input type="checkbox" checked={adj} onChange={e=>setAdj(e.target.checked)} /> Include adjustments</label>
    <label className="row"><input type="checkbox" checked={unsettled} onChange={e=>setUnsettled(e.target.checked)} /> Only unsettled</label>
    <button onClick={download} className="btn">Download CSV</button>
  </div></div>);
}
