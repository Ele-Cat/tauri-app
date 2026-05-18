import request from "./request";

export const userApi = {
  getUserList: () => request.get("/users"),
  getUserById: (id) => request.get(`/users/${id}`),
  createUser: (data) => request.post("/users", data),
  updateUser: (id, data) => request.put(`/users/${id}`, data),
  deleteUser: (id) => request.delete(`/users/${id}`),
};
