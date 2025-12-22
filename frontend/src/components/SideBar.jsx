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
} from "lucide-react";

export default function Sidebar() {
  const { user, logout, isAdmin, isStaff } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [];

  if (isAdmin) {
    navItems.push(
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/users", label: "Users", icon: Users }
    );
  }

  navItems.push(
    { path: "/departments", label: "Departments", icon: Building2 },
    { path: "/partnerships", label: "Partnerships", icon: Handshake }
  );

  if (isStaff || isAdmin) {
    navItems.push({ path: "/requests", label: "Requests", icon: FileText });
  }

  if (isAdmin) {
    navItems.push({
      path: "/notifications",
      label: "Notifications",
      icon: Bell,
    });
  }

  return (
    <div className="w-64 bg-slate-800 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold">School Partnerships</h1>
        <p className="text-sm text-slate-400 mt-1">{user?.username}</p>
        <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-slate-700 capitalize">
          {user?.role}
        </span>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(path)
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
