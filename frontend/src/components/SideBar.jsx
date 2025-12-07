// components/Sidebar.jsx
import { NavLink } from "react-router-dom";

export default function Sidebar({ menuItems }) {
  return (
    <aside className="w-64 min-h-screen border-r">
      <ul className="p-4 space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink 
              to={item.path} 
              className="block px-3 py-2 rounded hover:bg-gray-200"
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
