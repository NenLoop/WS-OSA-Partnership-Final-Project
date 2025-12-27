import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import {
  LayoutDashboard,
  Users,
  Building2,
  Handshake,
  FileText,
  Bell,
  LogOut,
  MoveLeft,
  UserCog,
} from "lucide-react";

export default function Sidebar({ open, setOpen }) {
  const { user, logout, isAdmin, isStaff } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [];

  navItems.push(
    { path: "/partnerships", label: "Partnerships", icon: Handshake },
    { path: "/departments", label: "Departments", icon: Building2 }
  );

  if (isStaff) {
    navItems.push({ path: "/requests", label: "Requests", icon: FileText });
  }

  if (isAdmin) {
    navItems.push(
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/requests", label: "Requests", icon: FileText },
      { path: "/users", label: "Users", icon: Users },
      { path: "/notifications", label: "Notifications", icon: Bell }
    );
  }

  return (
    <div className="flex">
      <div
        className={`bg-slate-800 text-white min-h-screen p-5 pt-8 ${
          open ? "w-64" : "w-20"
        } duration-300 relative`}
      >
        <MoveLeft
          className={` text-xl text-white absolute right-2 top-3 cursor-pointer  ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />

        <div className="flex flex-col items-center">
          <img
            src="/hcdc-logo-final.png"
            alt="Logo"
            className={`mb-4 mx-auto ${open ? "w-18" : "w-10"} duration-300`}
          />
          <h1
            className={`text-md text-center font-bold mb-3 duration-300 ${
              !open && "hidden "
            }`}
          >
            Institutional Partnership Monitoring Program
          </h1>
        </div>

        <ul className="space-y-2 mt-3">
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center gap-3 px-2 py-2 w-full rounded-lg transition-colors ${
                  isActive(path)
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Icon size={20} />
                <p className={`text-sm duration-300 ${!open && "hidden"}`}>
                  {label}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="py-5">
          <button className="flex items-center w-full gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
            <UserCog size={20} />
            <div className={`items-start  ${!open && "hidden"}`}>
              <p className="text-sm text-slate-400 mt-1">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-slate-700 capitalize">
                {user?.role}
              </span>
            </div>
          </button>
        </div>

        <div className="border-t border-slate-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <p className={`text-sm duration-300 ${!open && "hidden"}`}>
              Logout
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
