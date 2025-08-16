"use client";
import { useEffect } from "react";

export function Toast({kind,msg,onClose}:{kind:"ok"|"err"|"info",msg:string,onClose?:()=>void}){
  useEffect(()=>{ const t = setTimeout(()=>onClose?.(),2500); return ()=>clearTimeout(t);},[msg]);
  return <div className={`toast ${kind}`}>{msg}</div>;
}
