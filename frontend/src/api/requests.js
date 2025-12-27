import api from "./axios";

export const getRequests = async ({ page = 1 }) => {
  const response = await api.get("/requests/", {
    params: {
      page,
    },
  });
  return response.data;
};

export const getRequest = async (id) => {
  const response = await api.get(`/requests/${id}/`);
  return response.data;
};

export const createRequest = async (data) => {
  const response = await api.post("/requests/", data);
  return response.data;
};

export const approveRequest = async ({ id, remarks }) => {
  const response = await api.post(`/requests/${id}/approve/`, { remarks });
  return response.data;
};

export const declineRequest = async ({ id, remarks }) => {
  const response = await api.post(`/requests/${id}/decline/`, { remarks });
  return response.data;
};
