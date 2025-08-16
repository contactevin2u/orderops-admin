export const metadata = {
  title: "OrderOps Admin",
  description: "High-volume intake, rentals, instalments, buybacks",
};
import "./globals.css";
export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="row" style={{justifyContent:"space-between", marginBottom:16}}>
            <div className="row" style={{gap:10, alignItems:"center"}}>
              <div className="title">OrderOps</div>
              <span className="badge">Admin</span>
            </div>
            <nav className="row" style={{gap:8}}>
              <a className="btn" href="/">Intake</a>
              <a className="btn" href="/ops/create">Create</a>
              <a className="btn" href="/orders">Orders</a>
              <a className="btn" href="/calendar">Calendar</a>
              <a className="btn" href="/reports/aging">Aging</a>
              <a className="btn" href="/export">Export</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
