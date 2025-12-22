import { useDashboardStats } from "../hooks/useDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, Building2, Handshake, Clock } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats?.total_users || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Departments",
      value: stats?.total_departments || 0,
      icon: Building2,
      color: "bg-green-500",
    },
    {
      label: "Partnerships",
      value: stats?.total_partnerships || 0,
      icon: Handshake,
      color: "bg-purple-500",
    },
    {
      label: "Pending Requests",
      value: stats?.pending_requests || 0,
      icon: Clock,
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-4">
              <div className={`${color} p-3 rounded-lg text-white`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Partnerships by Department
        </h2>
        {stats?.partnerships_by_department?.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.partnerships_by_department}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" name="Partnerships" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No data available</p>
        )}
      </div>
    </div>
  );
}
