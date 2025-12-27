import { useState } from "react";
import {
  useNotifications,
  useMarkSeen,
  useMarkAllSeen,
} from "../hooks/useNotifications";
import { Bell, Check, CheckCheck } from "lucide-react";

export default function Notifications() {
  const [page, setPage] = useState(1);
  const { data: notifications, isLoading } = useNotifications(page);
  const markSeenMutation = useMarkSeen();
  const markAllSeenMutation = useMarkAllSeen();

  const handleMarkSeen = async (id) => {
    await markSeenMutation.mutateAsync(id);
  };

  const handleMarkAllSeen = async () => {
    await markAllSeenMutation.mutateAsync();
  };

  const getTypeColor = (type) => {
    const colors = {
      created: "bg-green-500",
      updated: "bg-blue-500",
      deleted: "bg-red-500",
    };
    return colors[type] || "bg-slate-500";
  };

  const unseenCount =
    notifications?.results.filter((n) => n.status === "unseen").length || 0;

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unseenCount > 0 && (
            <span className="bg-red-500 text-white px-2 py-0.5 text-sm rounded-full">
              {unseenCount} new
            </span>
          )}
        </div>
        {unseenCount > 0 && (
          <button
            onClick={handleMarkAllSeen}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <CheckCheck size={20} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications?.results.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow p-4 flex items-start gap-4 ${
              notification.status === "unseen"
                ? "border-l-4 border-blue-500"
                : ""
            }`}
          >
            <div
              className={`${getTypeColor(
                notification.notification_type
              )} p-2 rounded-full text-white`}
            >
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    {notification.message ||
                      `Partnership ${notification.notification_type}`}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    By {notification.user_name} -{" "}
                    {notification.partnership_name || "N/A"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                {notification.status === "unseen" && (
                  <button
                    onClick={() => handleMarkSeen(notification.id)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Mark as read"
                  >
                    <Check size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between mt-6">
          <button
            disabled={!notifications?.previous}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {notifications?.current_page} of {notifications?.total_pages}
          </span>

          <button
            disabled={!notifications?.next}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {notifications?.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
