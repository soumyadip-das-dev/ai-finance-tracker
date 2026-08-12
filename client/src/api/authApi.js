import API from "./axios";

export const loginApi = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);
  return data;
};

export const registerApi = async (userData) => {
  const { data } = await API.post("/auth/register", userData);
  return data;
};