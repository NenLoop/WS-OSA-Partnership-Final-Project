import { jwtDecode } from "jwt-decode";
import SideBar from "../components/SideBar.jsx";

export default function AdminLayout() {
    const token = localStorage.getItem("access");
    const user = token ? jwtDecode(token) : null;

    const menu = [
        { label: "Home", path: "/" },
        { label: "Profile", path: "/profile" },
        user?.is_staff && { label: "Department Dashboard", path: "/admin/dashboard" },
        user?.is_superuser && { label: "Admin Panel", path: "/admin/manage" },
    ].filter(Boolean);

    return (
        <div className="flex">
            <SideBar menuItems={menu} />
            <main className="flex-1 p-6"><Outlet /></main>
        </div>
    );
}
