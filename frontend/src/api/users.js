import api from "./axios";

export const getUsers = async ({ page = 1 }) => {
  const response = await api.get("/users/", {
    params: {
      page,
    },
  });
  return response.data;
};

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}/`);
  return response.data;
};

export const createUser = async (data) => {
  const response = await api.post("/users/", data);
  return response.data;
};

export const updateUser = async ({ id, ...data }) => {
  const response = await api.put(`/users/${id}/`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}/`);
  return response.data;
};

export const assignStaff = async (data) => {
  const response = await api.post("/users/assign_staff/", data);
  return response.data;
};
