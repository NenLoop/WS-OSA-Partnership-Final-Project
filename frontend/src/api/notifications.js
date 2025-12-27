import api from "./axios";

export const getNotifications = async ({ page = 1 }) => {
  const response = await api.get("/notifications/", {
    params: {
      page,
    },
  });
  return response.data;
};

export const markSeen = async (id) => {
  const response = await api.post(`/notifications/${id}/mark_seen/`);
  return response.data;
};

export const markAllSeen = async () => {
  const response = await api.post("/notifications/mark_all_seen/");
  return response.data;
};
