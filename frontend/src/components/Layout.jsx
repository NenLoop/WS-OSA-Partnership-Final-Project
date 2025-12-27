import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export default function Layout() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="fixed inset-y-0 left-0 z-30">
        <SideBar open={open} setOpen={setOpen} />
      </div>
      <main
        className={`flex-1 p-6 overflow-auto ${
          open ? "ml-64" : "ml-20"
        } duration-300`}
      >
        <Outlet />
      </main>
    </div>
  );
}
