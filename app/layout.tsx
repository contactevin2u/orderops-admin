import Link from "next/link";
import "./globals.css";

export const metadata = { title: "OrderOps System", description: "Order Operations Management UI" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>
    <nav className="nav">
      <div className="title" style={{ marginRight: 8 }}>Order Ops</div>
      <Link href="/">Intake</Link>
      <Link href="/orders">Orders</Link>
      <Link href="/ops">Ops</Link>
      <Link href="/export">Export</Link>
      <span className="small" style={{ marginLeft: "auto" }}>Press <kbd className="kbd">?</kbd></span>
    </nav>
    <div className="container">{children}</div>
  </body></html>);
}
