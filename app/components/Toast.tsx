"use client";
import { useEffect } from "react";
export type Toast = { kind: "ok" | "err" | "info"; msg: string };
export function ToastView({ toast, onDone }: { toast: Toast | null; onDone(): void }) {
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(onDone, 2500);
    return () => clearTimeout(id);
  }, [toast, onDone]);
  if (!toast) return null;
  const color = toast.kind === "ok" ? "bg-green-600" : toast.kind === "err" ? "bg-red-600" : "bg-gray-700";
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 text-white rounded shadow ${color}`}>
      {toast.msg}
    </div>
  );
}
