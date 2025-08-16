"use client";
import { API } from "../../lib/api";

export default function ExportPage(){
  function download(){
    const url = API("/export/xlsx");
    window.location.href = url;
  }
  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Export</h1>
      <p>Download a full XLSX export for accounting/import.</p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={download}>Download XLSX</button>
    </div>
  );
}
