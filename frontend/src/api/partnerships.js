import api from "./axios";

export const getPartnerships = async (params = {}) => {
  const response = await api.get("/partnerships/", { params });
  return response.data;
};

export const getPartnership = async (id) => {
  const response = await api.get(`/partnerships/${id}/`);
  return response.data;
};

export const createPartnership = async (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  const response = await api.post("/partnerships/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updatePartnership = async ({ id, ...data }) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  const response = await api.put(`/partnerships/${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deletePartnership = async (id) => {
  const response = await api.delete(`/partnerships/${id}/`);
  return response.data;
};
