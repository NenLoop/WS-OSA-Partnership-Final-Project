import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>
      <main className="flex-1 p-6 overflow-auto ml-64">
        <Outlet />
      </main>
    </div>
  );
}
