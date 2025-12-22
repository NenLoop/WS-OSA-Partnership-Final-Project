import api from "./axios";

export const getNotifications = async () => {
  const response = await api.get("/notifications/");
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
