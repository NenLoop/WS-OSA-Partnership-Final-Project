// layouts/UserLayout.jsx
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar.jsx";

const userMenu = [
  { label: "Home", path: "/" },
  { label: "Profile", path: "/profile" },
  // No Dashboard here — users cannot access it
];

export default function UserLayout() {
  return (
    <div className="flex">
      <SideBar menuItems={userMenu} />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
