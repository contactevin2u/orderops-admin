export function SummaryRow({label,value}:{label:string; value:any}){
  return <div className="row" style={{justifyContent:"space-between"}}><div style={{color:"#93c5fd"}}>{label}</div><div>{String(value ?? "—")}</div></div>
}
